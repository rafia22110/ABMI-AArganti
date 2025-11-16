import React from 'react';
import type { Dataset, GroundingChunk } from '../types';
import ExportMenu from './ExportMenu';

interface ResultsDisplayProps {
  datasets: Dataset[];
  sources: GroundingChunk[];
  t: {
    sourcesTitle: string;
    useCasesTitle: string;
    export: {
        title: string;
        json: string;
        csv: string;
        python_pandas: string;
        tf_pytorch: string;
        copied: string;
    }
  };
}

const DatasetCard: React.FC<{ dataset: Dataset, t: ResultsDisplayProps['t'] }> = ({ dataset, t }) => (
    <div className="bg-brand-primary p-4 rounded-lg border border-gray-700">
        <h3 className="text-xl font-bold text-indigo-400">
            {dataset.link ? (
                <a href={dataset.link} target="_blank" rel="noopener noreferrer" className="hover:underline">
                    {dataset.name}
                </a>
            ) : (
                dataset.name
            )}
        </h3>
        <p className="mt-2 text-brand-text-secondary">{dataset.summary}</p>
        <div className="mt-3">
            <h4 className="font-semibold text-sm text-brand-text">{t.useCasesTitle}:</h4>
            <div className="flex flex-wrap gap-2 mt-1">
                {dataset.use_cases.map((useCase, i) => (
                    <span key={i} className="bg-brand-secondary text-xs font-medium px-2 py-1 rounded-full">
                        {useCase}
                    </span>
                ))}
            </div>
        </div>
    </div>
);


const ResultsDisplay: React.FC<ResultsDisplayProps> = ({ datasets, sources, t }) => {
  return (
    <div className="bg-brand-secondary p-6 rounded-lg shadow-lg animate-fade-in">
        <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-brand-text">Results</h2>
            {datasets.length > 0 && <ExportMenu datasets={datasets} t={t.export} />}
        </div>
      
      {datasets.length > 0 ? (
        <div className="space-y-4">
          {datasets.map((ds, index) => (
            <DatasetCard key={index} dataset={ds} t={t} />
          ))}
        </div>
      ) : (
        <p className="text-center text-brand-text-secondary">No datasets found for your query.</p>
      )}

      {sources.length > 0 && (
        <div className="mt-8 pt-4 border-t border-gray-600">
          <h4 className="text-lg font-semibold text-brand-text-secondary mb-3">{t.sourcesTitle}:</h4>
          <ul className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-2">
            {sources.map((source, index) => (
              <li key={index} className="truncate">
                <a
                  href={source.web.uri}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-indigo-400 hover:text-indigo-300 transition-colors duration-200 text-sm"
                  title={source.web.title}
                >
                  <span className="me-2">{index + 1}.</span>{source.web.title}
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default ResultsDisplay;
