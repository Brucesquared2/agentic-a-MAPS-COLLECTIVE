#!/usr/bin/env python3
"""
Risk Policy Merger

Merges risk policies from indicator manifests into a consolidated risk.yml file.
This script aggregates risk configurations from multiple sources.
"""

import sys
import yaml
from pathlib import Path
from typing import Dict, List, Any
from datetime import datetime, timezone


class RiskMerger:
    """Merges risk policies from various manifests."""
    
    def __init__(self, repo_root: Path):
        self.repo_root = repo_root
        self.risk_data: Dict[str, Any] = {
            'version': '1.0',
            'generated_at': datetime.now(timezone.utc).isoformat().replace('+00:00', 'Z'),
            'policies': []
        }
    
    def extract_risk_from_signal_routing(self) -> None:
        """Extract risk policies from signal_routing.yml."""
        signal_path = self.repo_root / 'signal_routing.yml'
        if not signal_path.exists():
            return
        
        try:
            with open(signal_path, 'r') as f:
                data = yaml.safe_load(f)
            
            # Convert routes to risk policies
            if 'routes' in data:
                for route in data['routes']:
                    policy = {
                        'id': f"RISK_{route.get('id', 'UNKNOWN')}",
                        'source': 'signal_routing.yml',
                        'trigger': route.get('trigger', ''),
                        'agent': route.get('agent', ''),
                        'repo': route.get('repo', ''),
                        'risk_level': self._assess_risk_level(route),
                        'mitigation': self._generate_mitigation(route)
                    }
                    self.risk_data['policies'].append(policy)
                    
        except Exception as e:
            print(f"Warning: Could not process signal_routing.yml: {e}")
    
    def extract_risk_from_agents(self) -> None:
        """Extract risk policies from AGENTS.yml."""
        agents_path = self.repo_root / 'AGENTS.yml'
        if not agents_path.exists():
            return
        
        try:
            with open(agents_path, 'r') as f:
                data = yaml.safe_load(f)
            
            # Convert agent weaknesses to risk policies
            if 'agents' in data:
                for agent in data['agents']:
                    if 'weaknesses' in agent:
                        policy = {
                            'id': f"RISK_AGENT_{agent.get('name', 'UNKNOWN').upper().replace(' ', '_')}",
                            'source': 'AGENTS.yml',
                            'agent': agent.get('name', ''),
                            'weaknesses': agent.get('weaknesses', ''),
                            'risk_level': 'medium',
                            'mitigation': f"Monitor {agent.get('name', '')} operations and validate outputs"
                        }
                        self.risk_data['policies'].append(policy)
                        
        except Exception as e:
            print(f"Warning: Could not process AGENTS.yml: {e}")
    
    def _assess_risk_level(self, route: Dict[str, Any]) -> str:
        """Assess risk level for a route."""
        # Simple heuristic based on destination type
        dest_type = route.get('destination', {}).get('type', '')
        
        if dest_type == 'device':
            return 'high'  # Hardware control is high risk
        elif dest_type == 'software':
            return 'medium'
        else:
            return 'low'
    
    def _generate_mitigation(self, route: Dict[str, Any]) -> str:
        """Generate mitigation strategy for a route."""
        agent = route.get('agent', '')
        dest_name = route.get('destination', {}).get('name', '')
        
        return f"Validate {agent} outputs before sending to {dest_name}"
    
    def merge_all(self) -> Dict[str, Any]:
        """Merge all risk policies from available sources."""
        print("🔄 Merging risk policies...")
        
        self.extract_risk_from_signal_routing()
        self.extract_risk_from_agents()
        
        print(f"  ✓ Merged {len(self.risk_data['policies'])} policies")
        
        return self.risk_data
    
    def write_risk_file(self, output_path: Path) -> None:
        """Write merged risk data to file."""
        output_path.parent.mkdir(parents=True, exist_ok=True)
        
        with open(output_path, 'w') as f:
            yaml.safe_dump(self.risk_data, f, default_flow_style=False, sort_keys=False)
        
        print(f"✅ Risk policies written to {output_path}")


def main():
    """Main entry point."""
    repo_root = Path(__file__).parent.parent
    output_path = repo_root / 'ta_service' / 'config' / 'risk.yml'
    
    merger = RiskMerger(repo_root)
    merger.merge_all()
    merger.write_risk_file(output_path)
    
    print("\n📋 Summary:")
    print(f"  - Total policies: {len(merger.risk_data['policies'])}")
    print(f"  - Output: {output_path}")


if __name__ == '__main__':
    main()
