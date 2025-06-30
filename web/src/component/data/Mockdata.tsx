import { tokens } from "../../theme";
import { RiHomeSmileLine } from "react-icons/ri";
import { IoFolderOpenOutline } from "react-icons/io5";
import { BsChatRightDots } from "react-icons/bs";
import { IoSettingsOutline as SettingsIcon } from "react-icons/io5";
import { AiOutlineUsergroupAdd as PersonIcon } from "react-icons/ai";
import { AiOutlineAppstoreAdd as AddToDriveOutlinedIcon } from "react-icons/ai";

const Colors = tokens();

export const Systemnavdata: { id: number; name: string; icon: JSX.Element; path: string }[] = [
    {
        id: 2,
        name: "System Management",
        icon: <SettingsIcon></SettingsIcon>,
        path: "/settings/general"
    },
    {
        id: 1,
        name: "User Management",
        icon: <PersonIcon></PersonIcon>,
        path: "/settings/user-management"
    },
    {
        id: 5,
        name: "Apps Management",
        icon: <AddToDriveOutlinedIcon></AddToDriveOutlinedIcon>,
        path: "/settings/app-store"
    },
    {
        id: 6,
        name: "Experts Management",
        icon: <AddToDriveOutlinedIcon></AddToDriveOutlinedIcon>,
        path: "/settings/expert-management"
    }
];

export const Managementdata: User[] = [
    {
        id: 1,
        name: "James Tipton",
        role: "user",
        email: "jtipton01@example.com"
    },
    {
        id: 2,
        name: "Lara Gibson",
        role: "admin",
        email: "lgibson02@example.com"
    },
    {
        id: 3,
        name: "Haruto Tanaka",
        role: "user",
        email: "htanaka03@example.com"
    },
    {
        id: 4,
        name: "Eva Laurent",
        role: "user",
        email: "elaurent04@example.com"
    },
    {
        id: 5,
        name: "Mohamed Al Fayed",
        role: "admin",
        email: "malfayed05@example.com"
    },
    {
        id: 6,
        name: "Sofia Pintos",
        role: "user",
        email: "spintos06@example.com"
    },
    {
        id: 7,
        name: "Carlos Diaz",
        role: "user",
        email: "cdiaz07@example.com"
    },
    {
        id: 8,
        name: "Anna Schmidt",
        role: "user",
        email: "aschmidt08@example.com"
    },
    {
        id: 9,
        name: "Kenji Sato",
        role: "user",
        email: "ksato09@example.com"
    }
];

export type User = {
    id: number;
    name: string;
    role: string;
    email: string;
};

export const data = [
    {
        id: 1,
        filename: "data_protection.pdf",
        description: "Data Protection Standard 2025 (DPS-2025)",
        author: "Venkatesh Siddi",
        createdAt: "21 Jan 2024",
        lastUpdate: "24 Mar 2024",
        category: "Work",
        categoryColor: "#00bcd4"
    },
    {
        id: 2,
        filename: "incident_irp.pdf",
        description: "Cyber Incident Response Protocol (CIRP)",
        author: "Venkatesh Siddi",
        createdAt: "21 Jan 2024",
        lastUpdate: "24 Mar 2024",
        category: "Work",
        categoryColor: "#00bcd4"
    },
    {
        id: 3,
        filename: "eula_document.pdf",
        description: "End-User Encryption Requirement (EUER)",
        author: "Venkatesh Siddi",
        createdAt: "21 Jan 2024",
        lastUpdate: "24 Mar 2024",
        category: "Personal",
        categoryColor: "#ff5722"
    },
    {
        id: 4,
        filename: "3rd-party-risk.pdf",
        description: "Third-Party Vendor Security Assessment (TPVSA)",
        author: "Venkatesh Siddi",
        createdAt: "21 Jan 2024",
        lastUpdate: "24 Mar 2024",
        category: "Personal",
        categoryColor: "#ff5722"
    },
    {
        id: 5,
        filename: "sdlc_document-venky.pdf",
        description: "Software Development Life Cycle Security Compliance (SDLC-SC)",
        author: "Venkatesh Siddi",
        createdAt: "21 Jan 2024",
        lastUpdate: "24 Mar 2024",
        category: "Personal",
        categoryColor: "#ff5722"
    },
    {
        id: 6,
        filename: "sdlc_document_astik.pdf",
        description: "Software Development Life Cycle Security Compliance (SDLC-SC)",
        author: "Venkatesh Siddi",
        createdAt: "21 Jan 2024",
        lastUpdate: "24 Mar 2024",
        category: "Personal",
        categoryColor: "#ff5722"
    }
];

export const Categories = [
    {
        id: 1,
        name: "Documents",
        color: Colors.personal[100],
        viewer: 0,
        doc_count: 20
    },
    {
        id: 2,
        name: "Policies",
        color: Colors.work[100],
        viewer: 50,
        doc_count: 10
    },
    {
        id: 3,
        name: "Standards",
        color: Colors.project[100],
        viewer: 34,
        doc_count: 35
    },
    {
        id: 4,
        name: "Incidents",
        color: Colors.app_doc[100],
        viewer: 20,
        doc_count: 40
    },
    {
        id: 5,
        name: "Projects"
    }
];

export const carouselItems = [
    {
        label: "Security Co-Pilot",
        src: "expert.svg",
        typography: "Meet Security CoPilot."
    },
    {
        label: "Playbooks",
        src: "playbooks.svg",
        typography: "Own you AI Connect with your playbooks!"
    },
    {
        label: "Assets",
        src: "assets.svg",
        typography: "Explore your assets and their security posture."
    },
    {
        label: "Documents",
        src: "documents.svg",
        typography: "No more searching, Let AI assist you better."
    },
    {
        label: "News",
        src: "news.svg",
        typography: "Talk to me about latest attacks, threats all covered."
    },

    {
        label: "Policies",
        src: "policies.svg",
        typography: "Talk about your policies and compliance."
    },
    {
        label: "Regulatory",
        src: "regulatory.svg",
        typography: "Regulations and legal requirements."
    },
    {
        label: "Standards",
        src: "standards.svg",
        typography: "Industry standards and best practices."
    },

    {
        label: "Threats",
        src: "threats.svg",
        typography: "Identifying and mitigating potential threats."
    }
];

export const navData = [
    {
        name: "Home",
        icon: RiHomeSmileLine,
        path: "/"
    },
    {
        name: "FileVault",
        icon: IoFolderOpenOutline,
        path: "/files"
    },
    {
        name: "Chats",
        icon: BsChatRightDots,
        path: "/ai-chat"
    },
];

export const folderList = [
    { name: "Sales folder" },
    { name: "Copywriting folder" },
    { name: "Legal folder" },
    { name: "Cuboid folder" }
];
export const options = [
    { value: 'Security', label: 'Security' },
    { value: 'IT', label: 'IT' },
    { value: 'AI Security', label: 'AI Security' },
    { value: 'Data Privacy', label: 'Data Privacy' },
    { value: 'Privacy Policies', label: 'Privacy Policies' },
    { value: 'Encryption', label: 'Encryption' },
  ];

export const categoryBlog = [
    {
        title: "Phishing Email Analysis",
        date: "2024-04-17",
        created_by: "Security Team",
        description:
            "A procedural guideline to analyze and respond to suspected phishing emails to prevent security breaches and data loss.",
        content:
            "1. Identify and confirm the sender's authenticity. 2. Examine links and attachments using secure tools. 3. Report to IT security via standardized process. 4. Block sender and malicious URLs across the network. 5. Educate employees regularly on identifying such emails."
    },
    {
        title: "Risk Assessment on Changes",
        date: "2024-04-17",
        created_by: "Risk Management Team",
        description:
            "Standard operating procedure for assessing risks associated with proposed changes in IT infrastructure or business processes.",
        content:
            "1. Document the proposed changes. 2. Identify potential risks and impacts. 3. Conduct impact analysis with stakeholders. 4. Develop mitigation strategies. 5. Approve or reject changes based on risk assessment. 6. Review and refine the process post-implementation."
    },
    {
        title: "New Vulnerability Detected ",
        date: "2024-04-17",
        created_by: "Cybersecurity Operations Center",
        description:
            "A playbook for rapid response to newly detected vulnerabilities on external assets exposed to the internet.",
        content:
            "1. Verify the vulnerability report. 2. Prioritize assets based on exposure and criticality. 3. Apply patches or temporary fixes. 4. Test the fixes in a staging environment. 5. Deploy fixes to production. 6. Monitor for abnormal activity. 7. Update stakeholders and document the process."
    },
    {
        title: "Internal Penetration Testing",
        date: "2024-04-17",
        created_by: "Pen Testing Team",
        description:
            "A guideline for conducting internal penetration tests to identify and address security weaknesses within corporate IT infrastructure.",
        content:
            "1. Scope definition and stakeholder agreement. 2. Gather intelligence on the target environment. 3. Perform vulnerability analysis and exploitation. 4. Document findings and recommend mitigations. 5. Conduct post-test review meetings with stakeholders."
    },
    {
        title: "External Penetration Testing",
        date: "2024-04-17",
        created_by: "Pen Testing Team",
        description:
            "Framework for executing external penetration tests to uncover potential security vulnerabilities from an outsider perspective.",
        content:
            "1. Define the scope with external boundaries. 2. Conduct reconnaissance of external IP ranges and domains. 3. Exploit identified vulnerabilities to assess impact. 4. Provide detailed report and recommendations. 5. Review and refine defenses based on findings."
    },
    {
        title: "Data Breach Response",
        date: "2024-04-17",
        created_by: "Incident Response Team",
        description:
            "Operational playbook for responding to data breaches to minimize damage and restore security.",
        content:
            "1. Confirm and classify the breach. 2. Contain the breach to prevent further data loss. 3. Assess the impact on data and systems. 4. Notify affected individuals and regulatory bodies if necessary. 5. Implement recovery plans. 6. Review and update security measures."
    },
    {
        title: "DDoS Mitigation",
        date: "2024-04-17",
        created_by: "Network Security Team",
        description:
            "Strategies and actions to mitigate Distributed Denial of Service (DDoS) attacks targeting company resources.",
        content:
            "1. Detect and confirm DDoS attack via monitoring systems. 2. Activate response plan including traffic rerouting. 3. Implement rate limiting and filter attack traffic. 4. Coordinate with ISP for further mitigation. 5. Analyze attack patterns and bolster defenses."
    },
    {
        title: "Third-party Security Assessment",
        date: "2024-04-17",
        created_by: "Compliance Team",
        description:
            "Procedure for assessing the security posture of third-party vendors to ensure compliance with company security standards.",
        content:
            "1. Identify key third-party services and vendors. 2. Review existing security policies and practices of the third parties. 3. Perform regular security audits. 4. Require remediation of identified issues. 5. Continuously monitor compliance and update agreements."
    },
    {
        title: "Security Awareness Training",
        date: "2024-04-17",
        created_by: "HR & Security Training Team",
        description:
            "Continuous education program to enhance the security awareness among employees at all levels.",
        content:
            "1. Develop a comprehensive training curriculum on security best practices. 2. Deliver regular training sessions and workshops. 3. Conduct phishing simulation exercises. 4. Evaluate employee security awareness periodically. 5. Update training content based on emerging threats."
    },
    {
        title: "Secure Software Development Life Cycle (SDLC)",
        date: "2024-04-17",
        created_by: "Development Team",
        description:
            "Guidelines to integrate security measures throughout the software development process.",
        content:
            "1. Integrate security requirements in the planning phase. 2. Perform security testing in the coding phase. 3. Conduct security reviews and threat modeling. 4. Implement secure deployment practices. 5. Monitor and respond to issues in deployed applications."
    },
    {
        title: "Secure Software Development Life Cycle (SDLC)",
        date: "2024-04-17",
        created_by: "Development Team",
        description:
            "Guidelines to integrate security measures throughout the software development process.",
        content:
            "1. Integrate security requirements in the planning phase. 2. Perform security testing in the coding phase. 3. Conduct security reviews and threat modeling. 4. Implement secure deployment practices. 5. Monitor and respond to issues in deployed applications."
    },
    {
        title: "Secure Software Development Life Cycle (SDLC)",
        date: "2024-04-17",
        created_by: "Development Team",
        description:
            "Guidelines to integrate security measures throughout the software development process.",
        content:
            "1. Integrate security requirements in the planning phase. 2. Perform security testing in the coding phase. 3. Conduct security reviews and threat modeling. 4. Implement secure deployment practices. 5. Monitor and respond to issues in deployed applications."
    },
    {
        title: "Secure Software Development Life Cycle (SDLC)",
        date: "2024-04-17",
        created_by: "Development Team",
        description:
            "Guidelines to integrate security measures throughout the software development process.",
        content:
            "1. Integrate security requirements in the planning phase. 2. Perform security testing in the coding phase. 3. Conduct security reviews and threat modeling. 4. Implement secure deployment practices. 5. Monitor and respond to issues in deployed applications."
    }
];
export const menuOptions = [
    {
        label: "Security Playbooks",
        avatarSrc: "playbooks.svg",
        description:
            "Detailed guides and strategies to respond to various security incidents and maintain robust defense mechanisms."
    },
    {
        label: "Security Compliance",
        avatarSrc: "compliance.svg",
        description:
            "Guidelines and practices to ensure compliance with legal and security standards in corporate environments."
    },
    {
        label: "Cybersecurity Experts",
        avatarSrc: "expert.svg",
        description:
            "Consultation services from top cybersecurity experts to enhance your company's security posture."
    },
    {
        label: "Regulatory Standards",
        avatarSrc: "regulatory.svg",
        description:
            "Ensuring adherence to regulatory requirements and standards across all operations."
    },
    {
        label: "Security Documents",
        avatarSrc: "documents.svg",
        description:
            "Important security documentation, policies, and procedures crucial for maintaining organizational integrity."
    },
    {
        label: "Threat Analysis",
        avatarSrc: "threats.svg",
        description:
            "Comprehensive threat analysis to identify potential vulnerabilities and preemptively address security challenges."
    },
    {
        label: "Security Standards",
        avatarSrc: "standards.svg",
        description:
            "Adopting and implementing recognized security standards to protect corporate data and assets."
    },
    {
        label: "Security Policies",
        avatarSrc: "policies.svg",
        description:
            "Development and enforcement of security policies that shape the security landscape of the organization."
    }
];

type MessageType = {
    id: number;
    avatar: string;
    name: string;
    message: string;
  };
  
  export type UserDataType = {
    id: string;
    avatar: string;
    messages?: MessageType[];
    name: string;
    start_questions?: string[];
    type?: string;
    categories?: string[];
    expert_name:string;
    description:string;
  };
  

export const userData = [
    {
        id: 1,
        avatar: "https://github.com/shadcn.png",
        messages: [
            {
                id: 1,
                avatar: "https://github.com/shadcn.png",
                name: "Jakob Hoeg",
                message:
                    "Hi, can you help me understand how your security assessments work?,Hi, can you help me understand how your security assessments work?"
            },
            {
                id: 2,
                avatar: "https://github.com/shadcn.png",
                name: "Network Security",
                message:
                    "Certainly! Our security assessments are comprehensive evaluations designed to identify vulnerabilities in your system, suggest enhancements, and help implement security protocols. Are you looking for a specific type of assessment?"
            },
            {
                id: 3,
                avatar: "https://github.com/shadcn.png",
                name: "Jakob Hoeg",
                message: "What measures do you take to ensure data privacy during your assessments?"
            },
            {
                id: 4,
                avatar: "https://github.com/shadcn.png",
                name: "Network Security",
                message:
                    "We adhere strictly to data privacy laws and guidelines. All data collected during assessments is encrypted and only accessible to authorized personnel. We ensure all vulnerabilities are addressed without compromising your data privacy."
            },
            {
                id: 5,
                avatar: "https://github.com/shadcn.png",
                name: "Jakob Hoeg",
                message: "Can you handle a sudden increase in security threats?"
            },
            {
                id: 6,
                avatar: "https://github.com/shadcn.png",
                name: "Network Security",
                message:
                    "Absolutely. Our rapid response teams are equipped to scale up operations in response to increased threat levels, ensuring your assets remain protected under all circumstances."
            },
            {
                id: 7,
                avatar: "https://github.com/shadcn.png",
                name: "Jakob Hoeg",
                message: "How often do you recommend conducting security audits?"
            },
            {
                id: 8,
                avatar: "https://github.com/shadcn.png",
                name: "Network Security",
                message:
                    "For most organizations, we recommend security audits at least annually, or more frequently depending on the evolving threat landscape and specific industry regulations."
            }
        ],
        name: "Network Security",
     

    },
    {
        id: 2,
        avatar: "https://github.com/shadcn.png",
        name: "Application Security",
      
    },
    {
        id: 3,
        avatar: "https://github.com/shadcn.png",
        name: "Cloud Security",
      
    },
    {
        id: 4,
        avatar: "https://github.com/shadcn.png",
        name: "Endpoint Security",
       
    }
];

export type UserData = (typeof userData)[number];

export const loggedInUserData = {
    id: 5,
    avatar: "https://github.com/shadcn.png",
    name: "Jakob Hoeg"
};

export type LoggedInUserData = typeof loggedInUserData;

export interface Message {
    id?: number;
    avatar?: string;
    name?: string;
    message?: string;
    expert_name?: string;
    type?:string;
    category?:string;
    categories?:string[];
    bot?:string;
    chat_id?:string;
    
}


export interface ChatUser {
    id: number;
    avatar: string;
    messages: Message[];
    name: string;
    expert_name: string;
  
}

export const history = [
    {
        date: "Previous 7 days",
        chats: [
            "Implementing end-to-end encryption",
            "Security incident response",
            "Managing access controls",
            "Vulnerability scanning best practices"
        ]
    },
    {
        date: "Previous 30 days",
        chats: [
            "Penetration testing results",
            "Secure coding guidelines",
            "Establishing a zero-trust architecture",
            "Discussing security audits"
        ]
    },
    {
        date: "2023",
        chats: [
            "Data protection and compliance",
            "Multi-factor authentication (MFA) implementation",
            "Developing security awareness training",
            "Integrating security into DevOps (DevSecOps)"
        ]
    },
    {
        date: "2023",
        chats: [
            "Incident response plan review",
            "Security tool evaluation",
            "Ransomware prevention strategies",
            "Secure software development lifecycle (SDLC)"
        ]
    },
    {
        date: "2023",
        chats: [
            "Regular security updates and patching",
            "Insider threat detection",
            "Security risk assessment",
            "Encryption protocols and standards"
        ]
    }
];

export const ChatEdit = [
    {
        avatar: "https://github.com/shadcn.png",
        name: "Network Security",
        description: "Lorem ipsum dolor, sit amet"
    },
    {
        avatar: "https://github.com/shadcn.png",
        name: "Network Security",
        description: "Lorem ipsum dolor, sit amet"
    },
    {
        avatar: "https://github.com/shadcn.png",
        name: "Network Security",
        description: "Lorem ipsum dolor, sit amet"
    },
    {
        avatar: "https://github.com/shadcn.png",
        name: "Network Security",
        description: "Lorem ipsum dolor, sit amet"
    },
    {
        avatar: "https://github.com/shadcn.png",
        name: "Network Security",
        description: "Lorem ipsum dolor, sit amet"
    },
    {
        avatar: "https://github.com/shadcn.png",
        name: "Network Security",
        description: "Lorem ipsum dolor, sit amet"
    }
];

export const content = [
    {
        id: "6635fbc306d20e2c64c57909",
        created_at: "2024-05-03T08:47:41.082000",
        updated_at: "2024-05-04T09:11:31.548000",
        chat_id: "6634759d3f66ab66db70ede9",
        user_prompt: "hello",
        response: [
            {
                id: "cmpl-9288788549064339a4420d005812c59f_662fdfab8541441f1f88d683",
                choices: [
                    {
                        finish_reason: "stop",
                        index: 0,
                        message: {
                            content:
                                "Hello, I am ZySec, your AI Assistant specialized in CyberSecurity & GRC matters. I am programmed to provide expert insights and advice in the field of cybersecurity. If at any point during our conversation, I am not clear on a topic, I will ask follow-up questions to ensure accurate information is delivered. Thank you for choosing ZySec as your trusted cybersecurity advisor. How may I assist you today?",
                            role: "assistant"
                        }
                    }
                ],
                created: 1714813883,
                model: "gpt-3.5-turbo",
                object: "chat.completion",
                system_fingerprint: null,
                usage: {
                    completion_tokens: 91,
                    prompt_tokens: 86,
                    total_tokens: 177
                },
                _response_ms: 801.257
            },
            {
                id: "cmpl-6ea0b678f6b14ec3a95833016d13f8f9_662fdfab8541441f1f88d684",
                choices: [
                    {
                        finish_reason: "stop",
                        index: 0,
                        message: {
                            content:
                                "Dear [Client],\n\nAs a leading AI Assistant in CyberSecurity and Incident Management, I am here to provide you with expert insights and advice to help you mitigate and manage cybersecurity incidents.\n\nIn response to your request, I would like to clarify the following:\n\n1. What type of incident are you currently facing? Are you dealing with a data breach, malware attack, network intrusion, or a phishing scam? Understanding the specific nature of the incident will help us develop a tailored response plan.\n\n2. What is the current state of the affected systems and data? Have you isolated the infected devices or networks? Are the affected systems still operational or have they been taken offline? Have you identified any patterns or anomalies in the data?\n\n3. Have you notified the relevant authorities, such as law enforcement and regulatory bodies, about the incident? If so, have they provided any guidance or assistance?\n\n4. What is your preferred communication style? Do you prefer detailed technical explanations, high-level overviews, or something in between? This will help us tailor our communication to your specific needs.\n\n5. What specific cybersecurity and incident management services are you interested in? Do you need assistance with incident response planning, cybersecurity strategy development, incident response training, or incident response tabletop exercises?\n\n6. Do you have any specific cybersecurity challenges or concerns that you would like us to address? Are there any emerging threats or trends that you would like us to provide insights on?\n\nBased on your responses to these questions, we will be able to provide you with a more tailored and effective cybersecurity and incident management service. Please don't hesitate to reach out to us if you have any further questions or concerns.\n\nBest regards,\n\n[ZySec AI Assistant]",
                            role: "assistant"
                        }
                    }
                ],
                created: 1714813883,
                model: "gpt-3.5-turbo",
                object: "chat.completion",
                system_fingerprint: null,
                usage: {
                    completion_tokens: 392,
                    prompt_tokens: 154,
                    total_tokens: 546
                },
                _response_ms: 2819.793
            },
            {
                id: "cmpl-54c76809e1984149a8f6a579c7f7c16e_662fdfab8541441f1f88d685",
                choices: [
                    {
                        finish_reason: "stop",
                        index: 0,
                        message: {
                            content:
                                "As a specialized AI Assistant in Security Incident & Analysis, I am designed to provide expert cybersecurity insights and advice in response to security incidents or potential security threats. If I am unclear about any aspect of the incident or threat, I will promptly ask follow-up questions to gather more information and context to deliver accurate and actionable recommendations. My primary focus is to mitigate the impact of the incident or threat and prevent similar incidents from occurring in the future.",
                            role: "assistant"
                        }
                    }
                ],
                created: 1714813886,
                model: "gpt-3.5-turbo",
                object: "chat.completion",
                system_fingerprint: null,
                usage: {
                    completion_tokens: 95,
                    prompt_tokens: 220,
                    total_tokens: 315
                },
                _response_ms: 836.019
            },
            {
                id: "cmpl-8ed64966817a401792c6cc050c0966cd_662fdfab8541441f1f88d686",
                choices: [
                    {
                        finish_reason: "stop",
                        index: 0,
                        message: {
                            content:
                                "Hello, I am ZySec, an AI Assistant specialized in CyberSecurity and exploitation. I am developed by the ZySec AI team, and my primary function is to provide expert cybersecurity insights and advice. If I am not clear in my responses, I will ask follow-up questions to gather more information and deliver more accurate information. Is there a specific area of CyberSecurity and exploitation that you would like me to focus on? Please let me know, and I will provide detailed insights and suggestions.",
                            role: "assistant"
                        }
                    }
                ],
                created: 1714813887,
                model: "gpt-3.5-turbo",
                object: "chat.completion",
                system_fingerprint: null,
                usage: {
                    completion_tokens: 107,
                    prompt_tokens: 287,
                    total_tokens: 394
                },
                _response_ms: 949.054
            },
            {
                id: "cmpl-38d26ed9234546d7bd856d6a9ebb5bb3_662fdfab8541441f1f88d687",
                choices: [
                    {
                        finish_reason: "stop",
                        index: 0,
                        message: {
                            content:
                                "As an AI Assistant focused on user and data privacy, I can inform you that protecting user data and ensuring privacy is a crucial aspect of cybersecurity. This involves implementing strong access controls, encrypting sensitive data, and following strict data handling procedures. It is also important to obtain user consent for data collection and to provide clear and concise privacy policies that users can easily understand. Data minimization, or only collecting and storing the necessary data, is another key principle of privacy protection. Regular security audits and risk assessments can help identify potential privacy breaches and address them before they occur. Ultimately, respecting user privacy is not only a legal requirement but also a moral obligation in today's connected world.",
                            role: "assistant"
                        }
                    }
                ],
                created: 1714813888,
                model: "gpt-3.5-turbo",
                object: "chat.completion",
                system_fingerprint: null,
                usage: {
                    completion_tokens: 146,
                    prompt_tokens: 352,
                    total_tokens: 498
                },
                _response_ms: 1220.964
            },
            {
                id: "cmpl-5a0dfc39d6e14e27a198fea1df8051dc_66359304c268f891f62b7c31",
                choices: [
                    {
                        finish_reason: "stop",
                        index: 0,
                        message: {
                            content:
                                "As an AI Assistant specialised in analysing input context and answering questions, I can provide expert cybersecurity insights and advice. If I am not clear in my response, I will ask follow-up questions to clarify the context and ensure that my answer is accurate. Cybersecurity is a crucial aspect of modern society, and it's essential to ensure that data and systems are protected against threats. Some key areas of cybersecurity that I can offer insights and advice on include network security, access control, cryptography, incident response, and compliance with data privacy laws. If you have any specific cybersecurity concerns or questions, please provide more context, and I will do my best to provide a detailed and accurate response.",
                            role: "assistant"
                        }
                    }
                ],
                created: 1714813889,
                model: "gpt-3.5-turbo",
                object: "chat.completion",
                system_fingerprint: null,
                usage: {
                    completion_tokens: 146,
                    prompt_tokens: 420,
                    total_tokens: 566
                },
                _response_ms: 1262.126
            },
            {
                id: "cmpl-5ff4c30651cb404d94b77d75db9dcbf9_66359391c268f891f62b7c32",
                choices: [
                    {
                        finish_reason: "stop",
                        index: 0,
                        message: {
                            content:
                                "Hello, thanks for reaching out. Please provide me with more context about the input you're asking a question about, and I'll do my best to provide an accurate and helpful response. If you need further clarification or have any follow-up questions, please don't hesitate to ask.",
                            role: "assistant"
                        }
                    }
                ],
                created: 1714813891,
                model: "gpt-3.5-turbo",
                object: "chat.completion",
                system_fingerprint: null,
                usage: {
                    completion_tokens: 63,
                    prompt_tokens: 488,
                    total_tokens: 551
                },
                _response_ms: 628.934
            }
        ],
        last_message_id: "6635ca6e06d20e2c64c5777c",
        created_by: "662ceec144eb3e7bded0e6f9"
    }
];
