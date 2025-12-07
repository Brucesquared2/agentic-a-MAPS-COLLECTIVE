#!/usr/bin/env python3
"""
CLI Tool for Agentic Platform Management

Provides commands for onboarding new indicators, managing manifests,
and other administrative tasks.
"""

import sys
import argparse
import yaml
from pathlib import Path
from typing import Dict, Any


class AgenticCLI:
    """Command-line interface for platform management."""
    
    def __init__(self, repo_root: Path):
        self.repo_root = repo_root
    
    def onboard_indicator(self, indicator: str, create_pr: bool = False) -> None:
        """
        Onboard a new indicator/agent to the platform.
        
        Args:
            indicator: Name/identifier of the indicator to onboard
            create_pr: Whether to create a pull request for the changes
        """
        print(f"🚀 Onboarding indicator: {indicator}")
        
        # Generate indicator configuration
        config = {
            'name': indicator,
            'type': 'indicator',
            'status': 'active',
            'capabilities': [],
            'risk_policies': []
        }
        
        # Create indicator directory
        indicator_dir = self.repo_root / 'indicators' / indicator
        indicator_dir.mkdir(parents=True, exist_ok=True)
        
        # Write indicator config
        config_path = indicator_dir / 'config.yml'
        with open(config_path, 'w') as f:
            yaml.safe_dump(config, f, default_flow_style=False)
        
        print(f"  ✓ Created config at {config_path}")
        
        # Update main manifests
        self._update_signal_routing(indicator)
        
        if create_pr:
            print(f"  ⚠️  PR creation not yet implemented")
            print(f"  📝 Please manually commit and create PR for {indicator}")
        else:
            print(f"  ✓ Indicator {indicator} onboarded successfully")
            print(f"  📝 Remember to commit changes")
    
    def _update_signal_routing(self, indicator: str) -> None:
        """Add indicator to signal routing configuration."""
        signal_path = self.repo_root / 'signal_routing.yml'
        
        if not signal_path.exists():
            print(f"  ⚠️  signal_routing.yml not found, skipping update")
            return
        
        try:
            with open(signal_path, 'r') as f:
                data = yaml.safe_load(f)
            
            # Add route for new indicator
            new_route = {
                'id': f'R{len(data.get("routes", [])) + 1}',
                'trigger': 'Manual onboarding',
                'agent': indicator,
                'repo': f'{indicator}-repository',
                'tasks': ['Initialize', 'Configure'],
                'destination': {
                    'type': 'software',
                    'name': indicator,
                    'connection': 'local',
                    'port': '8080'
                },
                'outcome': f'{indicator} initialized and configured'
            }
            
            if 'routes' not in data:
                data['routes'] = []
            
            data['routes'].append(new_route)
            
            with open(signal_path, 'w') as f:
                yaml.safe_dump(data, f, default_flow_style=False, sort_keys=False)
            
            print(f"  ✓ Updated signal_routing.yml")
            
        except Exception as e:
            print(f"  ⚠️  Could not update signal_routing.yml: {e}")
    
    def list_indicators(self) -> None:
        """List all onboarded indicators."""
        indicators_dir = self.repo_root / 'indicators'
        
        if not indicators_dir.exists():
            print("No indicators directory found")
            return
        
        print("📋 Onboarded Indicators:")
        for indicator_path in sorted(indicators_dir.iterdir()):
            if indicator_path.is_dir():
                config_path = indicator_path / 'config.yml'
                if config_path.exists():
                    try:
                        with open(config_path, 'r') as f:
                            config = yaml.safe_load(f)
                        status = config.get('status', 'unknown')
                        print(f"  - {indicator_path.name} (status: {status})")
                    except:
                        print(f"  - {indicator_path.name} (config error)")


def main():
    """Main entry point."""
    parser = argparse.ArgumentParser(
        description='Agentic Platform CLI',
        formatter_class=argparse.RawDescriptionHelpFormatter
    )
    
    subparsers = parser.add_subparsers(dest='command', help='Command to execute')
    
    # Onboard command
    onboard_parser = subparsers.add_parser('onboard', help='Onboard a new indicator')
    onboard_parser.add_argument('indicator', help='Indicator name/identifier')
    onboard_parser.add_argument('--pr', action='store_true', help='Create pull request')
    
    # List command
    list_parser = subparsers.add_parser('list', help='List onboarded indicators')
    
    args = parser.parse_args()
    
    if not args.command:
        parser.print_help()
        sys.exit(1)
    
    repo_root = Path(__file__).parent.parent
    cli = AgenticCLI(repo_root)
    
    if args.command == 'onboard':
        cli.onboard_indicator(args.indicator, args.pr)
    elif args.command == 'list':
        cli.list_indicators()
    else:
        parser.print_help()
        sys.exit(1)


if __name__ == '__main__':
    main()
