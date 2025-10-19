

export type Order = {
  id: string;
  versionId: string;
  orderNumber: string;
  orderCustomer: {
    /** Unique identity of order customer */
    id: string;
    customerId: string;
    /** Unique identity of OrderCustomer's version */
    versionId: string;
    /** Email address of the customer */
    email: string;
    /** Unique identity of salutation */
    salutationId?: string;
    /** First name of the customer */
    firstName: string;
    /** Last name of the customer */
    lastName: string;
    /** Name of the company */
    company?: string;
    /** Title name given to the customer like Dr, prof. etc */
    title?: string;
    /** Unique identity of VAT */
    vatIds?: string[];
    /** Unique number assigned to the customer */
    customerNumber?: string;
    /** Additional fields that offer a possibility to add own fields for the different program-areas */
    customFields?: Record<string, unknown>;
    /** Creation timestamp */
    createdAt: string;
    /** Last update timestamp */
    updatedAt: string;
  };
};
