#!/usr/bin/env python3
"""
Manifest Validator

Validates YAML manifests for signal routing, agents, and dashboard configuration.
Checks schema compliance, required fields, and data integrity.
"""

import sys
import yaml
from pathlib import Path
from typing import Dict, List, Any, Optional


class ManifestValidator:
    """Validates various manifest types in the repository."""
    
    def __init__(self, repo_root: Path):
        self.repo_root = repo_root
        self.errors: List[str] = []
        self.warnings: List[str] = []
    
    def validate_signal_routing(self, manifest_path: Path) -> bool:
        """Validate signal_routing.yml schema."""
        try:
            with open(manifest_path, 'r') as f:
                data = yaml.safe_load(f)
            
            # Check version
            if 'version' not in data:
                self.errors.append(f"{manifest_path}: Missing 'version' field")
            
            # Check settings
            if 'settings' not in data:
                self.errors.append(f"{manifest_path}: Missing 'settings' section")
            elif 'ledger_path' not in data['settings']:
                self.errors.append(f"{manifest_path}: Missing 'ledger_path' in settings")
            
            # Check devices
            if 'devices' in data:
                for idx, device in enumerate(data['devices']):
                    if 'name' not in device:
                        self.errors.append(f"{manifest_path}: Device {idx} missing 'name'")
                    if 'type' not in device:
                        self.errors.append(f"{manifest_path}: Device {idx} missing 'type'")
                    if 'connection' not in device:
                        self.errors.append(f"{manifest_path}: Device {idx} missing 'connection'")
            
            # Check routes
            if 'routes' in data:
                for idx, route in enumerate(data['routes']):
                    required_fields = ['id', 'trigger', 'agent', 'repo', 'tasks', 'destination', 'outcome']
                    for field in required_fields:
                        if field not in route:
                            self.errors.append(f"{manifest_path}: Route {idx} missing '{field}'")
                    
                    # Validate destination
                    if 'destination' in route:
                        dest = route['destination']
                        if 'type' not in dest or 'name' not in dest:
                            self.errors.append(f"{manifest_path}: Route {idx} destination incomplete")
            
            return len(self.errors) == 0
            
        except yaml.YAMLError as e:
            self.errors.append(f"{manifest_path}: YAML parse error: {e}")
            return False
        except FileNotFoundError:
            self.errors.append(f"{manifest_path}: File not found")
            return False
    
    def validate_agents(self, manifest_path: Path) -> bool:
        """Validate AGENTS.yml schema."""
        try:
            with open(manifest_path, 'r') as f:
                data = yaml.safe_load(f)
            
            if 'agents' not in data:
                self.errors.append(f"{manifest_path}: Missing 'agents' array")
                return False
            
            for idx, agent in enumerate(data['agents']):
                required_fields = ['name', 'strengths', 'weaknesses']
                for field in required_fields:
                    if field not in agent:
                        self.errors.append(f"{manifest_path}: Agent {idx} missing '{field}'")
            
            return len(self.errors) == 0
            
        except yaml.YAMLError as e:
            self.errors.append(f"{manifest_path}: YAML parse error: {e}")
            return False
        except FileNotFoundError:
            self.errors.append(f"{manifest_path}: File not found")
            return False
    
    def validate_dashboard(self, manifest_path: Path) -> bool:
        """Validate dashboard.yml schema."""
        try:
            with open(manifest_path, 'r') as f:
                data = yaml.safe_load(f)
            
            if 'dashboard' not in data:
                self.errors.append(f"{manifest_path}: Missing 'dashboard' section")
                return False
            
            if 'panels' not in data['dashboard']:
                self.errors.append(f"{manifest_path}: Missing 'panels' in dashboard")
                return False
            
            # Verify panel files exist
            for panel in data['dashboard']['panels']:
                panel_path = self.repo_root / panel
                if not panel_path.exists():
                    self.warnings.append(f"{manifest_path}: Panel file not found: {panel}")
            
            return len(self.errors) == 0
            
        except yaml.YAMLError as e:
            self.errors.append(f"{manifest_path}: YAML parse error: {e}")
            return False
        except FileNotFoundError:
            self.errors.append(f"{manifest_path}: File not found")
            return False
    
    def validate_all(self) -> bool:
        """Validate all known manifests in the repository."""
        manifests = {
            'signal_routing.yml': self.validate_signal_routing,
            'AGENTS.yml': self.validate_agents,
            'dashboard.yml': self.validate_dashboard,
        }
        
        all_valid = True
        for manifest_name, validator_func in manifests.items():
            manifest_path = self.repo_root / manifest_name
            if manifest_path.exists():
                print(f"Validating {manifest_name}...")
                if not validator_func(manifest_path):
                    all_valid = False
            else:
                self.warnings.append(f"Manifest not found: {manifest_name}")
        
        return all_valid
    
    def print_results(self):
        """Print validation results."""
        if self.errors:
            print("\n❌ Validation Errors:")
            for error in self.errors:
                print(f"  - {error}")
        
        if self.warnings:
            print("\n⚠️  Warnings:")
            for warning in self.warnings:
                print(f"  - {warning}")
        
        if not self.errors and not self.warnings:
            print("\n✅ All manifests valid!")
        elif not self.errors:
            print("\n✅ No errors found (warnings present)")


def main():
    """Main entry point."""
    repo_root = Path(__file__).parent.parent
    validator = ManifestValidator(repo_root)
    
    print("🔍 Running manifest validation...")
    valid = validator.validate_all()
    validator.print_results()
    
    sys.exit(0 if valid else 1)


if __name__ == '__main__':
    main()
