#!/usr/bin/env python3
"""
Verify deep-research-swarm skill structure.
Run this after editing the skill to catch common structural regressions.
"""

import os
import sys

SKILL_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

def check_file(path, desc):
    full = os.path.join(SKILL_DIR, path)
    exists = os.path.exists(full)
    status = "PASS" if exists else "FAIL"
    print(f"  [{status}] {desc}: {path}")
    return exists

def check_dir(path, desc):
    full = os.path.join(SKILL_DIR, path)
    exists = os.path.isdir(full)
    status = "PASS" if exists else "FAIL"
    print(f"  [{status}] {desc}: {path}")
    return exists

def main():
    print("=== Deep Research Swarm Structure Verification ===\n")
    
    all_ok = True
    
    # Core files
    print("Core files:")
    all_ok &= check_file("SKILL.md", "Main skill file")
    
    # References
    print("\nReference files:")
    refs = [
        "references/README.md",
        "references/academic-narrative-structure.md",
        "references/arxiv.md",
        "references/blogwatcher.md",
        "references/cite-them-right-harvard.md",
        "references/docx-conversion-notes.md",
        "references/excel-xlsx.md",
        "references/free-academic-sources.md",
        "references/llm-wiki.md",
        "references/pure-style-slides.md",
        "references/quality-gate.md",
        "references/streaming-dispatch.md",
        "references/subagent-pitfalls.md",
        "references/test-report-template.md",
        "references/testing-and-validation.md",
        "references/testing-recipe.md",
        "references/word-docx.md",
    ]
    for ref in refs:
        all_ok &= check_file(ref, "Reference")
    
    # Templates
    print("\nTemplates:")
    all_ok &= check_file("templates/docx-academic-template.py", "DOCX academic template")
    all_ok &= check_file("templates/pptx-pure-minimal.js", "PPTX Pure Minimal template")
    
    # Scripts
    print("\nScripts:")
    all_ok &= check_file("scripts/verify-skill-structure.py", "Structure verification script")
    
    # Directories
    print("\nDirectories:")
    all_ok &= check_dir("references", "References directory")
    all_ok &= check_dir("templates", "Templates directory")
    all_ok &= check_dir("scripts", "Scripts directory")
    
    print(f"\n{'='*50}")
    if all_ok:
        print("ALL CHECKS PASSED")
        return 0
    else:
        print("SOME CHECKS FAILED — review above")
        return 1

if __name__ == "__main__":
    sys.exit(main())
