const ticketData = [
  {
    id: "TCK-1001",
    subject: "Unable to login to customer portal",
    description:
      "Customer is unable to access the portal.",
    requester: "Kavitha",
    requesterEmail:
      "kavitha@example.com",
    category: "Technical",
    priority: "High",
    status: "Open",
    assignedTo: "Arun Kumar",
    createdAt: "2026-09-28T15:30:00+05:30",
    slaHours: 4,
    comments: [],
    attachments: [],
    activity: [
      {
        type: "created",
        message: "Ticket created",
        date: "2026-09-28T15:30:00+05:30"
      }
    ]
  },
  {
    id: "TCK-1002",
    subject: "Payment transaction failed",
    description:
      "Payment is failing during checkout.",
    requester: "Priya",
    requesterEmail:
      "priya@example.com",
    category: "Billing",
    priority: "Critical",
    status: "In Progress",
    assignedTo: "Meena Raj",
    createdAt: "2026-09-28T11:15:00+05:30",
    slaHours: 2,
    comments: [],
    attachments: [],
    activity: [
      {
        type: "created",
        message: "Ticket created",
        date: "2026-09-28T11:15:00+05:30"
      },
      {
        type: "status",
        message:
          "Status changed from Open to In Progress",
        date: "2026-09-28T12:00:00+05:30"
      }
    ]
  },
  {
    id: "TCK-1003",
    subject: "Request for account update",
    description:
      "Customer requested profile information update.",
    requester: "Rahul",
    requesterEmail:
      "rahul@example.com",
    category: "Account",
    priority: "Medium",
    status: "Pending",
    assignedTo: "Arun Kumar",
    createdAt: "2026-09-27T14:20:00+05:30",
    slaHours: 8,
    comments: [],
    attachments: [],
    activity: [
      {
        type: "created",
        message: "Ticket created",
        date: "2026-09-27T14:20:00+05:30"
      },
      {
        type: "status",
        message:
          "Status changed from Open to Pending",
        date: "2026-09-27T16:00:00+05:30"
      }
    ]
  },
  {
    id: "TCK-1004",
    subject: "Application page loading slowly",
    description:
      "The dashboard takes too long to load.",
    requester: "Divya",
    requesterEmail:
      "divya@example.com",
    category: "Technical",
    priority: "High",
    status: "Open",
    assignedTo: "Sanjay Kumar",
    createdAt: "2026-09-27T10:45:00+05:30",
    slaHours: 4,
    comments: [],
    attachments: [],
    activity: [
      {
        type: "created",
        message: "Ticket created",
        date: "2026-09-27T10:45:00+05:30"
      }
    ]
  },
  {
    id: "TCK-1005",
    subject: "Invoice download issue",
    description:
      "Customer cannot download invoice PDF.",
    requester: "Suresh",
    requesterEmail:
      "suresh@example.com",
    category: "Billing",
    priority: "Medium",
    status: "Resolved",
    assignedTo: "Meena Raj",
    createdAt: "2026-09-26T09:30:00+05:30",
    slaHours: 8,
    comments: [],
    attachments: [],
    activity: [
      {
        type: "created",
        message: "Ticket created",
        date: "2026-09-26T09:30:00+05:30"
      },
      {
        type: "status",
        message:
          "Status changed from Open to Resolved",
        date: "2026-09-26T13:00:00+05:30"
      }
    ]
  },
  {
    id: "TCK-1006",
    subject: "Password reset request",
    description:
      "Customer needs assistance resetting password.",
    requester: "Anitha",
    requesterEmail:
      "anitha@example.com",
    category: "Account",
    priority: "Low",
    status: "Closed",
    assignedTo: "Arun Kumar",
    createdAt: "2026-09-25T09:00:00+05:30",
    slaHours: 12,
    comments: [],
    attachments: [],
    activity: [
      {
        type: "created",
        message: "Ticket created",
        date: "2026-09-25T09:00:00+05:30"
      },
      {
        type: "status",
        message:
          "Status changed from Open to Closed",
        date: "2026-09-25T15:00:00+05:30"
      }
    ]
  },
  {
    id: "TCK-1007",
    subject: "Email notification not received",
    description:
      "Customer is not receiving ticket notifications.",
    requester: "Vignesh",
    requesterEmail:
      "vignesh@example.com",
    category: "Technical",
    priority: "High",
    status: "In Progress",
    assignedTo: "Sanjay Kumar",
    createdAt: "2026-09-25T13:45:00+05:30",
    slaHours: 4,
    comments: [],
    attachments: [],
    activity: [
      {
        type: "created",
        message: "Ticket created",
        date: "2026-09-25T13:45:00+05:30"
      },
      {
        type: "status",
        message:
          "Status changed from Open to In Progress",
        date: "2026-09-25T14:30:00+05:30"
      }
    ]
  },
  {
    id: "TCK-1008",
    subject: "Subscription renewal question",
    description:
      "Customer wants clarification about renewal.",
    requester: "Harini",
    requesterEmail:
      "harini@example.com",
    category: "Billing",
    priority: "Medium",
    status: "Open",
    assignedTo: "Meena Raj",
    createdAt: "2026-09-24T11:00:00+05:30",
    slaHours: 8,
    comments: [],
    attachments: [],
    activity: [
      {
        type: "created",
        message: "Ticket created",
        date: "2026-09-24T11:00:00+05:30"
      }
    ]
  },
  {
    id: "TCK-1009",
    subject: "Unable to update profile",
    description:
      "Profile changes are not being saved.",
    requester: "Manoj",
    requesterEmail:
      "manoj@example.com",
    category: "Account",
    priority: "Low",
    status: "Resolved",
    assignedTo: "Arun Kumar",
    createdAt: "2026-09-24T08:30:00+05:30",
    slaHours: 12,
    comments: [],
    attachments: [],
    activity: [
      {
        type: "created",
        message: "Ticket created",
        date: "2026-09-24T08:30:00+05:30"
      },
      {
        type: "status",
        message:
          "Status changed from Open to Resolved",
        date: "2026-09-24T12:30:00+05:30"
      }
    ]
  },
  {
    id: "TCK-1010",
    subject: "Server connectivity issue",
    description:
      "Customer reports intermittent connectivity problems.",
    requester: "Deepak",
    requesterEmail:
      "deepak@example.com",
    category: "Technical",
    priority: "Critical",
    status: "Open",
    assignedTo: "Sanjay Kumar",
    createdAt: "2026-09-23T16:00:00+05:30",
    slaHours: 2,
    comments: [],
    attachments: [],
    activity: [
      {
        type: "created",
        message: "Ticket created",
        date: "2026-09-23T16:00:00+05:30"
      }
    ]
  }
];

export default ticketData;