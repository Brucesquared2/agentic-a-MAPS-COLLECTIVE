#!/usr/bin/env python3
"""
New Manifest Generator

Generates new manifest files for indicators, agents, routes, and other entities.
Provides templates and scaffolding for consistent manifest creation.
"""

import sys
import argparse
import yaml
from pathlib import Path
from typing import Dict, Any
from datetime import datetime, timezone


class ManifestGenerator:
    """Generates new manifest files with proper structure."""
    
    def __init__(self, repo_root: Path):
        self.repo_root = repo_root
    
    def generate_indicator_manifest(self, indicator: str) -> Dict[str, Any]:
        """Generate manifest for a new indicator."""
        return {
            'version': '1.0',
            'metadata': {
                'name': indicator,
                'type': 'indicator',
                'created_at': datetime.now(timezone.utc).isoformat().replace('+00:00', 'Z'),
                'author': 'system'
            },
            'specification': {
                'capabilities': [
                    'monitoring',
                    'alerting'
                ],
                'dependencies': [],
                'configuration': {
                    'enabled': True,
                    'priority': 'medium'
                }
            },
            'risk_profile': {
                'level': 'low',
                'mitigation_required': False,
                'policies': []
            }
        }
    
    def generate_agent_manifest(self, agent_name: str) -> Dict[str, Any]:
        """Generate manifest for a new agent."""
        return {
            'name': agent_name,
            'strengths': 'To be defined',
            'weaknesses': 'To be defined',
            'notes': f'Agent {agent_name} configuration'
        }
    
    def generate_route_manifest(self, route_id: str) -> Dict[str, Any]:
        """Generate manifest for a new route."""
        return {
            'id': route_id,
            'trigger': 'To be defined',
            'agent': 'Agent name',
            'repo': 'Repository name',
            'tasks': [
                'Task 1',
                'Task 2'
            ],
            'destination': {
                'type': 'software',
                'name': 'Destination name',
                'connection': 'local',
                'port': '8080'
            },
            'outcome': 'Expected outcome'
        }
    
    def generate_device_manifest(self, device_name: str) -> Dict[str, Any]:
        """Generate manifest for a new device."""
        return {
            'name': device_name,
            'type': 'device',
            'connection': 'usb',
            'port': '8080',
            'capabilities': [],
            'status': 'active'
        }
    
    def create_manifest_file(
        self,
        indicator: str,
        manifest_type: str = 'indicator',
        output_dir: Path = None
    ) -> Path:
        """
        Create a new manifest file.
        
        Args:
            indicator: Name/identifier for the manifest
            manifest_type: Type of manifest (indicator, agent, route, device)
            output_dir: Directory to write manifest file
            
        Returns:
            Path to created manifest file
        """
        # Generate manifest data
        if manifest_type == 'indicator':
            data = self.generate_indicator_manifest(indicator)
            filename = f'{indicator}.manifest.yml'
        elif manifest_type == 'agent':
            data = self.generate_agent_manifest(indicator)
            filename = f'{indicator}.agent.yml'
        elif manifest_type == 'route':
            data = self.generate_route_manifest(indicator)
            filename = f'{indicator}.route.yml'
        elif manifest_type == 'device':
            data = self.generate_device_manifest(indicator)
            filename = f'{indicator}.device.yml'
        else:
            raise ValueError(f"Unknown manifest type: {manifest_type}")
        
        # Determine output directory
        if output_dir is None:
            output_dir = self.repo_root / 'manifests' / manifest_type
        
        output_dir.mkdir(parents=True, exist_ok=True)
        
        # Write manifest file
        manifest_path = output_dir / filename
        with open(manifest_path, 'w') as f:
            yaml.safe_dump(data, f, default_flow_style=False, sort_keys=False)
        
        return manifest_path
    
    def create_full_suite(self, indicator: str) -> None:
        """Create a full suite of manifests for an indicator."""
        print(f"📦 Creating manifest suite for: {indicator}")
        
        types = ['indicator', 'agent', 'route', 'device']
        created_files = []
        
        for manifest_type in types:
            try:
                path = self.create_manifest_file(indicator, manifest_type)
                created_files.append(path)
                print(f"  ✓ Created {manifest_type} manifest: {path}")
            except Exception as e:
                print(f"  ⚠️  Could not create {manifest_type} manifest: {e}")
        
        print(f"\n✅ Created {len(created_files)} manifest file(s)")
        print("\n📝 Next steps:")
        print("  1. Review and customize the generated manifests")
        print("  2. Run 'make validate' to check manifest validity")
        print("  3. Commit the changes to your repository")


def main():
    """Main entry point."""
    parser = argparse.ArgumentParser(
        description='Generate new manifest files',
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog="""
Examples:
  # Create an indicator manifest
  python scripts/new_manifest.py my-indicator
  
  # Create a specific type of manifest
  python scripts/new_manifest.py --type agent my-agent
  
  # Create a full suite of manifests
  python scripts/new_manifest.py --full-suite my-indicator
        """
    )
    
    parser.add_argument(
        'indicator',
        help='Name/identifier for the manifest'
    )
    parser.add_argument(
        '--type',
        choices=['indicator', 'agent', 'route', 'device'],
        default='indicator',
        help='Type of manifest to create (default: indicator)'
    )
    parser.add_argument(
        '--full-suite',
        action='store_true',
        help='Create a full suite of manifests (all types)'
    )
    parser.add_argument(
        '--output-dir',
        type=Path,
        help='Custom output directory for manifest files'
    )
    
    args = parser.parse_args()
    
    repo_root = Path(__file__).parent.parent
    generator = ManifestGenerator(repo_root)
    
    if args.full_suite:
        generator.create_full_suite(args.indicator)
    else:
        manifest_path = generator.create_manifest_file(
            args.indicator,
            args.type,
            args.output_dir
        )
        print(f"✅ Created manifest: {manifest_path}")
        print("\n📝 Next steps:")
        print("  1. Review and customize the generated manifest")
        print("  2. Run 'make validate' to check manifest validity")
        print("  3. Commit the changes to your repository")


if __name__ == '__main__':
    main()
