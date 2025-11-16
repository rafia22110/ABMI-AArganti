import React, { useState, useRef, useEffect } from 'react';
import type { Dataset } from '../types';

interface ExportMenuProps {
    datasets: Dataset[];
    t: {
        title: string;
        json: string;
        csv: string;
        python_pandas: string;
        tf_pytorch: string;
        copied: string;
    }
}

const MenuItem: React.FC<{onClick: () => void, children: React.ReactNode}> = ({ onClick, children }) => (
    <a 
        href="#"
        onClick={(e) => { e.preventDefault(); onClick(); }}
        className="flex items-center gap-3 px-4 py-2 text-sm text-brand-text hover:bg-brand-secondary transition-colors" 
        role="menuitem"
    >
        {children}
    </a>
);

const ExportMenu: React.FC<ExportMenuProps> = ({ datasets, t }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [copySuccess, setCopySuccess] = useState<'pandas' | 'tf' | ''>('');
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);
    
    const downloadFile = (filename: string, content: string, mimeType: string) => {
        const element = document.createElement("a");
        const file = new Blob([content], { type: mimeType });
        element.href = URL.createObjectURL(file);
        element.download = filename;
        document.body.appendChild(element);
        element.click();
        document.body.removeChild(element);
        setIsOpen(false);
    };

    const handleExportJson = () => {
        const jsonString = JSON.stringify(datasets, null, 2);
        downloadFile("datasets.json", jsonString, "application/json");
    };

    const handleExportCsv = () => {
        const header = "name,summary,use_cases,link,library_identifier\n";
        const rows = datasets.map(d => {
            const name = `"${(d.name || "").replace(/"/g, '""')}"`;
            const summary = `"${(d.summary || "").replace(/"/g, '""')}"`;
            const useCases = `"${(d.use_cases || []).join('; ')}"`;
            const link = d.link || "";
            const identifier = d.library_identifier || "";
            return [name, summary, useCases, link, identifier].join(',');
        }).join('\n');
        downloadFile("datasets.csv", "\uFEFF" + header + rows, "text/csv;charset=utf-8;");
    };
    
    const handleCopyPandas = () => {
        const dataString = JSON.stringify(datasets, null, 2);
        const snippet = `import pandas as pd
import json

# Data discovered using AI Inventor's Assistant
# For larger datasets, it's better to load from the exported JSON file.
json_data = """
${dataString}
"""

data = json.loads(json_data)
df = pd.DataFrame(data)
print(df.head())
`;
        navigator.clipboard.writeText(snippet).then(() => {
            setCopySuccess('pandas');
            setTimeout(() => setCopySuccess(''), 2000);
            setIsOpen(false);
        });
    };
    
    const handleCopyTfPytorch = () => {
        let snippet = `# Code snippets to load datasets using popular libraries.
# Note: You might need to install the required libraries first.
# pip install datasets tensorflow_datasets
`;
    
        datasets.forEach(d => {
            snippet += `
# ---
# Dataset: ${d.name}`;
            if (d.library_identifier) {
                snippet += `
# Found library identifier: "${d.library_identifier}"

# Option 1: Using Hugging Face 'datasets'
# from datasets import load_dataset
# hf_dataset = load_dataset("${d.library_identifier}")
# print(hf_dataset)

# Option 2: Using 'tensorflow_datasets'
# import tensorflow_datasets as tfds
# tfds_dataset = tfds.load("${d.library_identifier}")
# print(tfds_dataset)
`;
            } else {
                snippet += `
# No common library identifier found for this dataset.
# You may need to download it manually from: ${d.link || 'the source link.'}
`;
            }
        });
    
        navigator.clipboard.writeText(snippet.trim()).then(() => {
            setCopySuccess('tf');
            setTimeout(() => setCopySuccess(''), 2000);
            setIsOpen(false);
        });
    };

    return (
        <div className="relative" ref={dropdownRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="bg-brand-secondary hover:bg-gray-700 text-white font-bold py-2 px-4 rounded-md transition flex items-center gap-2"
                aria-haspopup="true"
                aria-expanded={isOpen}
            >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M4 3a2 2 0 100 4h12a2 2 0 100-4H4z" />
                    <path fillRule="evenodd" d="M3 8h14v7a2 2 0 01-2 2H5a2 2 0 01-2-2V8zm5 3a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1z" clipRule="evenodd" />
                </svg>
                {t.title}
            </button>
            {isOpen && (
                <div className="absolute z-10 end-0 mt-2 w-64 rounded-md shadow-lg bg-brand-primary ring-1 ring-black ring-opacity-5">
                    <div className="py-1" role="menu" aria-orientation="vertical" aria-labelledby="options-menu">
                        <MenuItem onClick={handleExportJson}>
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-yellow-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" /></svg>
                            <span>{t.json}</span>
                        </MenuItem>
                        <MenuItem onClick={handleExportCsv}>
                             <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h18M3 14h18m-9-4v8m-7 0h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>
                            <span>{t.csv}</span>
                        </MenuItem>
                        <MenuItem onClick={handleCopyPandas}>
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" /></svg>
                            <span>{copySuccess === 'pandas' ? t.copied : t.python_pandas}</span>
                        </MenuItem>
                         <MenuItem onClick={handleCopyTfPytorch}>
                             <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-orange-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" /></svg>
                            <span>{copySuccess === 'tf' ? t.copied : t.tf_pytorch}</span>
                        </MenuItem>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ExportMenu;