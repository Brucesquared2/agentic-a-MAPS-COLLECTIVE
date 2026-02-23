# Tests Directory

Unit tests for Python scripts and utilities.

## Test Structure

```
tests/
├── README.md                    # This file
└── test_validate_manifest.py   # Tests for manifest validator
```

## Running Tests

### Run all tests
```bash
pytest tests/ -v
```

### Run specific test file
```bash
pytest tests/test_validate_manifest.py -v
```

### Run tests with coverage
```bash
pytest tests/ --cov=scripts --cov-report=html
```

### Run tests quietly (for CI)
```bash
pytest -q tests/test_validate_manifest.py
```

## Test Coverage

### test_validate_manifest.py

Tests for `scripts/validate_manifest.py`:

- ✓ Valid signal_routing.yml validation
- ✓ Missing version field detection
- ✓ Missing ledger_path detection
- ✓ Valid AGENTS.yml validation
- ✓ Missing agent fields detection
- ✓ Valid dashboard.yml validation
- ✓ Missing panel files warning
- ✓ Invalid YAML detection
- ✓ File not found handling

## Writing New Tests

When adding new tests, follow these patterns:

### 1. Use pytest fixtures for setup/teardown
```python
@pytest.fixture
def temp_repo(self):
    """Create a temporary repository structure for testing."""
    temp_dir = Path(tempfile.mkdtemp())
    yield temp_dir
    shutil.rmtree(temp_dir)
```

### 2. Test both success and failure cases
```python
def test_valid_manifest(self, temp_repo):
    """Test validation of a valid manifest."""
    # Create valid manifest
    # Run validator
    # Assert success

def test_invalid_manifest(self, temp_repo):
    """Test validation of an invalid manifest."""
    # Create invalid manifest
    # Run validator
    # Assert failure with specific error
```

### 3. Use descriptive test names
- Start with `test_`
- Use clear, descriptive names: `test_valid_signal_routing`, `test_missing_version`
- Document what's being tested in the docstring

### 4. Assert specific behaviors
```python
assert validator.validate_signal_routing(manifest_path)
assert len(validator.errors) == 0
assert any('version' in error.lower() for error in validator.errors)
```

## CI Integration

Tests are run automatically in GitHub Actions:

### On push to main
```yaml
- name: Run validator unit tests
  run: pytest -q tests/test_validate_manifest.py
```

### Pre-commit hook
```yaml
- id: test-validator
  name: Run validator unit tests
  entry: pytest -q tests/test_validate_manifest.py
  language: system
  pass_filenames: false
```

## Dependencies

Required packages for testing:
```bash
pip install pytest pyyaml
```

For coverage reports:
```bash
pip install pytest-cov
```

## Test Best Practices

1. **Keep tests independent**: Each test should set up its own data and not depend on other tests
2. **Use temporary files**: Use `tempfile` for any file operations
3. **Clean up resources**: Use fixtures to ensure cleanup happens
4. **Test edge cases**: Include tests for boundary conditions and error cases
5. **Fast tests**: Keep tests fast by using minimal data
6. **Clear assertions**: Make it obvious what's being tested and why

## Adding Tests for New Scripts

When adding a new script to `scripts/`, create a corresponding test file:

1. Create `tests/test_<script_name>.py`
2. Import the module from scripts
3. Write test cases for all major functions
4. Test both success and failure paths
5. Update this README with the new test file

Example:
```python
# tests/test_new_script.py
import pytest
from pathlib import Path
import sys

sys.path.insert(0, str(Path(__file__).parent.parent / 'scripts'))
from new_script import MyClass

class TestMyClass:
    def test_my_function(self):
        """Test my_function does what it should."""
        result = MyClass().my_function()
        assert result == expected_value
```

## Debugging Tests

### Run with verbose output
```bash
pytest tests/test_validate_manifest.py -v
```

### Run with print statements visible
```bash
pytest tests/test_validate_manifest.py -s
```

### Run specific test
```bash
pytest tests/test_validate_manifest.py::TestManifestValidator::test_valid_signal_routing
```

### Drop into debugger on failure
```bash
pytest tests/test_validate_manifest.py --pdb
```

## Continuous Integration

Tests run on every:
- Push to main branch
- Pull request
- Pre-commit (local)

All tests must pass before merging to main.
