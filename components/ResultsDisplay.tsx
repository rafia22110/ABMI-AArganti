import React, { useState } from 'react';
import type { Dataset, GroundingChunk } from '../types';
import ExportMenu from './ExportMenu';
import SparkIcon from './icons/SparkIcon';
import { ThumbUpIcon, ThumbDownIcon } from './icons/ThumbIcons';

interface ResultsDisplayProps {
  datasets: Dataset[];
  sources: GroundingChunk[];
  answer?: string;
  t: {
    sourcesTitle: string;
    useCasesTitle: string;
    insightTitle: string;
    helpful: string;
    thanks: string;
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
    <div className="bg-brand-primary p-4 rounded-lg border border-gray-700 hover:border-brand-accent/50 transition-colors">
        <h3 className="text-xl font-bold text-indigo-400">
            {dataset.link ? (
                <a href={dataset.link} target="_blank" rel="noopener noreferrer" className="hover:underline">
                    {dataset.name}
                </a>
            ) : (
                dataset.name
            )}
        </h3>
        <p className="mt-2 text-brand-text-secondary leading-relaxed">{dataset.summary}</p>
        <div className="mt-3">
            <h4 className="font-semibold text-sm text-brand-text">{t.useCasesTitle}:</h4>
            <div className="flex flex-wrap gap-2 mt-1">
                {dataset.use_cases.map((useCase, i) => (
                    <span key={i} className="bg-brand-secondary text-xs font-medium px-2 py-1 rounded-full border border-gray-700">
                        {useCase}
                    </span>
                ))}
            </div>
        </div>
    </div>
);

const FeedbackWidget: React.FC<{ t: { helpful: string, thanks: string } }> = ({ t }) => {
    const [voted, setVoted] = useState(false);

    if (voted) {
        return <div className="text-center text-green-400 text-sm py-4 animate-fade-in">{t.thanks}</div>;
    }

    return (
        <div className="flex flex-col items-center justify-center mt-8 py-4 border-t border-gray-700/50">
            <span className="text-sm text-brand-text-secondary mb-2">{t.helpful}</span>
            <div className="flex gap-4">
                <button 
                    onClick={() => setVoted(true)}
                    className="p-2 rounded-full hover:bg-brand-primary hover:text-green-400 transition-colors text-brand-text-secondary"
                    aria-label="Yes"
                >
                    <ThumbUpIcon className="w-5 h-5" />
                </button>
                <button 
                    onClick={() => setVoted(true)}
                    className="p-2 rounded-full hover:bg-brand-primary hover:text-red-400 transition-colors text-brand-text-secondary"
                    aria-label="No"
                >
                    <ThumbDownIcon className="w-5 h-5" />
                </button>
            </div>
        </div>
    );
};

const ResultsDisplay: React.FC<ResultsDisplayProps> = ({ datasets, sources, answer, t }) => {
  return (
    <div className="bg-brand-secondary p-6 rounded-lg shadow-lg animate-fade-in mb-12">
        <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-brand-text">Results</h2>
            {datasets.length > 0 && <ExportMenu datasets={datasets} t={t.export} />}
        </div>

      {answer && (
          <div className="mb-8 bg-brand-primary/50 p-5 rounded-xl border border-indigo-500/20">
              <div className="flex items-center gap-2 mb-3">
                  <SparkIcon className="w-5 h-5 text-brand-accent" />
                  <h3 className="font-bold text-lg text-brand-text">{t.insightTitle}</h3>
              </div>
              <div className="text-brand-text-secondary whitespace-pre-wrap leading-relaxed">
                  {answer}
              </div>
          </div>
      )}
      
      {datasets.length > 0 ? (
        <div className="space-y-4">
          {datasets.map((ds, index) => (
            <DatasetCard key={index} dataset={ds} t={t} />
          ))}
        </div>
      ) : (
        !answer && <p className="text-center text-brand-text-secondary">No datasets found for your query.</p>
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
      
      <FeedbackWidget t={t} />
    </div>
  );
};

export default ResultsDisplay;