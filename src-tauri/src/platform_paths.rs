use std::fs;
use std::path::Path;

pub(crate) fn normalize_path_for_compare(path: &str) -> String {
    #[cfg(target_os = "windows")]
    {
        normalize_windows_path(path)
    }

    #[cfg(not(target_os = "windows"))]
    {
        let trimmed = path.trim_end_matches('/');
        if trimmed.is_empty() {
            "/".to_string()
        } else {
            trimmed.to_string()
        }
    }
}

#[cfg(target_os = "windows")]
fn normalize_windows_path(path: &str) -> String {
    let mut normalized = path.trim().replace('/', "\\");
    let folded = normalized.to_lowercase();
    if folded.starts_with(r"\\?\unc\") {
        normalized = format!(r"\\{}", &normalized[8..]);
    } else if folded.starts_with(r"\\?\") {
        normalized = normalized[4..].to_string();
    }

    let is_unc = normalized.starts_with(r"\\");
    let mut collapsed = String::with_capacity(normalized.len());
    let mut previous_separator = false;
    for (index, character) in normalized.chars().enumerate() {
        if character == '\\' {
            if !previous_separator || (is_unc && index < 2) {
                collapsed.push(character);
            }
            previous_separator = true;
        } else {
            collapsed.push(character);
            previous_separator = false;
        }
    }

    while collapsed.ends_with('\\') && !is_windows_root(&collapsed) {
        collapsed.pop();
    }
    collapsed.to_lowercase()
}

#[cfg(target_os = "windows")]
fn is_windows_root(path: &str) -> bool {
    let bytes = path.as_bytes();
    bytes.len() == 3 && bytes[1] == b':' && bytes[2] == b'\\'
}

pub(crate) fn paths_equal(left: &str, right: &str) -> bool {
    let left_path = Path::new(left);
    let right_path = Path::new(right);
    if let (Ok(left_canonical), Ok(right_canonical)) =
        (fs::canonicalize(left_path), fs::canonicalize(right_path))
    {
        return normalize_path_for_compare(&left_canonical.to_string_lossy())
            == normalize_path_for_compare(&right_canonical.to_string_lossy());
    }
    normalize_path_for_compare(left) == normalize_path_for_compare(right)
}

pub(crate) fn path_equal_or_nested(path: &str, parent: &str) -> bool {
    let normalized_path = normalize_path_for_compare(path);
    let normalized_parent = normalize_path_for_compare(parent);
    if normalized_path == normalized_parent {
        return true;
    }

    #[cfg(target_os = "windows")]
    let separator = '\\';
    #[cfg(not(target_os = "windows"))]
    let separator = '/';

    let mut prefix = normalized_parent;
    if !prefix.ends_with(separator) {
        prefix.push(separator);
    }
    normalized_path.starts_with(&prefix)
}

pub(crate) fn path_is_under(path: &Path, parent: &Path) -> bool {
    let path = fs::canonicalize(path).unwrap_or_else(|_| path.to_path_buf());
    let parent = fs::canonicalize(parent).unwrap_or_else(|_| parent.to_path_buf());
    path_equal_or_nested(&path.to_string_lossy(), &parent.to_string_lossy())
}

#[cfg(test)]
mod tests {
    use super::*;

    #[cfg(target_os = "windows")]
    #[test]
    fn windows_path_contract_handles_equivalent_forms() {
        // feat-001/AC-5
        assert!(paths_equal(r"C:\Work\Shelf", "c:/work/shelf/"));
        assert!(paths_equal(
            r"\\?\C:\Users\Ursin\项目",
            r"c:\users\ursin\项目"
        ));
        assert!(paths_equal(r"\\Server\Share\", r"\\server\share"));
    }

    #[cfg(target_os = "windows")]
    #[test]
    fn windows_path_contract_requires_component_boundaries() {
        // feat-001/AC-5 feat-002/AC-1
        assert!(path_equal_or_nested(r"C:\Work\Shelf\src", r"c:/work/shelf"));
        assert!(!path_equal_or_nested(
            r"C:\Work\Shelf-old",
            r"C:\Work\Shelf"
        ));
        assert!(path_equal_or_nested(r"C:\Windows", r"c:\"));
    }

    #[cfg(not(target_os = "windows"))]
    #[test]
    fn unix_path_contract_remains_case_sensitive() {
        // feat-001/AC-7
        assert!(path_equal_or_nested("/work/shelf/src", "/work/shelf"));
        assert!(!path_equal_or_nested("/work/Shelf", "/work/shelf"));
        assert!(!path_equal_or_nested("/work/shelf-old", "/work/shelf"));
    }
}
