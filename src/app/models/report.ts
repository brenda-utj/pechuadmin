export interface Attachment {
  filename: string;
  url: string;
  type?: string;
}

export interface Report {
  _id: string;
  eventId: string;
  userId: string;
  content: string;
  attachments: Attachment[];
  createdAt: string;
  updatedAt: string;
  active: boolean;
}
