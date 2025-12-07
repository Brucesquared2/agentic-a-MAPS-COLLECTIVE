"""
Unit tests for manifest validator.

Tests the validate_manifest.py script functionality.
"""

import pytest
import yaml
from pathlib import Path
import tempfile
import shutil


# Import the validator
import sys
sys.path.insert(0, str(Path(__file__).parent.parent / 'scripts'))
from validate_manifest import ManifestValidator


class TestManifestValidator:
    """Test cases for ManifestValidator."""
    
    @pytest.fixture
    def temp_repo(self):
        """Create a temporary repository structure for testing."""
        temp_dir = Path(tempfile.mkdtemp())
        yield temp_dir
        shutil.rmtree(temp_dir)
    
    def test_valid_signal_routing(self, temp_repo):
        """Test validation of a valid signal_routing.yml."""
        manifest_data = {
            'version': 1,
            'settings': {
                'ledger_path': 'logs/key_log.yml'
            },
            'devices': [
                {
                    'name': 'TestDevice',
                    'type': 'device',
                    'connection': 'usb',
                    'port': '8080'
                }
            ],
            'routes': [
                {
                    'id': 'R1',
                    'trigger': 'Test trigger',
                    'agent': 'Test Agent',
                    'repo': 'test-repo',
                    'tasks': ['Task 1'],
                    'destination': {
                        'type': 'device',
                        'name': 'TestDevice'
                    },
                    'outcome': 'Test outcome'
                }
            ]
        }
        
        manifest_path = temp_repo / 'signal_routing.yml'
        with open(manifest_path, 'w') as f:
            yaml.safe_dump(manifest_data, f)
        
        validator = ManifestValidator(temp_repo)
        assert validator.validate_signal_routing(manifest_path)
        assert len(validator.errors) == 0
    
    def test_missing_version(self, temp_repo):
        """Test validation fails when version is missing."""
        manifest_data = {
            'settings': {
                'ledger_path': 'logs/key_log.yml'
            }
        }
        
        manifest_path = temp_repo / 'signal_routing.yml'
        with open(manifest_path, 'w') as f:
            yaml.safe_dump(manifest_data, f)
        
        validator = ManifestValidator(temp_repo)
        assert not validator.validate_signal_routing(manifest_path)
        assert any('version' in error.lower() for error in validator.errors)
    
    def test_missing_ledger_path(self, temp_repo):
        """Test validation fails when ledger_path is missing."""
        manifest_data = {
            'version': 1,
            'settings': {}
        }
        
        manifest_path = temp_repo / 'signal_routing.yml'
        with open(manifest_path, 'w') as f:
            yaml.safe_dump(manifest_data, f)
        
        validator = ManifestValidator(temp_repo)
        assert not validator.validate_signal_routing(manifest_path)
        assert any('ledger_path' in error.lower() for error in validator.errors)
    
    def test_valid_agents(self, temp_repo):
        """Test validation of a valid AGENTS.yml."""
        manifest_data = {
            'agents': [
                {
                    'name': 'Test Agent',
                    'strengths': 'Testing',
                    'weaknesses': 'None',
                    'notes': 'Test notes'
                }
            ]
        }
        
        manifest_path = temp_repo / 'AGENTS.yml'
        with open(manifest_path, 'w') as f:
            yaml.safe_dump(manifest_data, f)
        
        validator = ManifestValidator(temp_repo)
        assert validator.validate_agents(manifest_path)
        assert len(validator.errors) == 0
    
    def test_missing_agent_fields(self, temp_repo):
        """Test validation fails when agent fields are missing."""
        manifest_data = {
            'agents': [
                {
                    'name': 'Test Agent'
                    # Missing strengths and weaknesses
                }
            ]
        }
        
        manifest_path = temp_repo / 'AGENTS.yml'
        with open(manifest_path, 'w') as f:
            yaml.safe_dump(manifest_data, f)
        
        validator = ManifestValidator(temp_repo)
        assert not validator.validate_agents(manifest_path)
        assert len(validator.errors) >= 2  # At least 2 missing fields
    
    def test_valid_dashboard(self, temp_repo):
        """Test validation of a valid dashboard.yml."""
        # Create panel files
        (temp_repo / 'panel1.md').write_text('Panel 1')
        (temp_repo / 'panel2.md').write_text('Panel 2')
        
        manifest_data = {
            'dashboard': {
                'panels': ['panel1.md', 'panel2.md']
            }
        }
        
        manifest_path = temp_repo / 'dashboard.yml'
        with open(manifest_path, 'w') as f:
            yaml.safe_dump(manifest_data, f)
        
        validator = ManifestValidator(temp_repo)
        assert validator.validate_dashboard(manifest_path)
        assert len(validator.errors) == 0
    
    def test_dashboard_missing_panels(self, temp_repo):
        """Test validation warns when panel files don't exist."""
        manifest_data = {
            'dashboard': {
                'panels': ['nonexistent.md']
            }
        }
        
        manifest_path = temp_repo / 'dashboard.yml'
        with open(manifest_path, 'w') as f:
            yaml.safe_dump(manifest_data, f)
        
        validator = ManifestValidator(temp_repo)
        assert validator.validate_dashboard(manifest_path)  # Should pass but with warnings
        assert len(validator.warnings) > 0
    
    def test_invalid_yaml(self, temp_repo):
        """Test validation fails with invalid YAML."""
        manifest_path = temp_repo / 'signal_routing.yml'
        manifest_path.write_text('invalid: yaml: content: [')
        
        validator = ManifestValidator(temp_repo)
        assert not validator.validate_signal_routing(manifest_path)
        assert len(validator.errors) > 0
    
    def test_file_not_found(self, temp_repo):
        """Test validation fails when file doesn't exist."""
        manifest_path = temp_repo / 'nonexistent.yml'
        
        validator = ManifestValidator(temp_repo)
        assert not validator.validate_signal_routing(manifest_path)
        assert any('not found' in error.lower() for error in validator.errors)


if __name__ == '__main__':
    pytest.main([__file__, '-v'])
