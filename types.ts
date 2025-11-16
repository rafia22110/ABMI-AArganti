export interface GroundingChunk {
  web: {
    uri: string;
    title: string;
  };
}

export interface Dataset {
    name: string;
    summary: string;
    use_cases: string[];
    link?: string;
    library_identifier?: string;
}
