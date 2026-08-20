export type TaxonomyTag = {
  id: string;
  label: string;
  cluster: 'study' | 'work' | 'visit' | 'saudi' | 'docs' | 'local' | 'process';
};

export type TaxonomyKeyword = {
  id: string;
  phrase: string;
  intent: 'informational' | 'commercial' | 'transactional' | 'navigational';
  status: 'tracking' | 'winning' | 'new' | 'paused';
  mappedTo?: 'news' | 'blog' | 'story' | 'lander';
};

export type Taxonomy = {
  tags: TaxonomyTag[];
  keywords: TaxonomyKeyword[];
};
