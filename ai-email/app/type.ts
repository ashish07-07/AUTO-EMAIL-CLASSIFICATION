export type CATEGORIZED_EMAILS = {
  subject: string;
  from: string;

  body: {
    text: string;
    html: string;
  };
  classification: string;
}[];

export type EMAIL = {
  id: string;
  subject: string;
  from: string;
  body: {
    text: string;
    html: string;
  };
};

export type CATEGORIZED_EMAILS2 = {
  subject: string;
  from: string;
  id: string;

  body: {
    text: string;
    html: string;
  };
  classification: string;
}[];
