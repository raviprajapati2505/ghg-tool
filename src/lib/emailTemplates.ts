export const projectCreatedTemplate = (projectName: string, year: string) => ({
    subject: `New Project Created: ${projectName}`,
    html: `
        <p>Hello,</p>
        <p>A new project has been created and requires your attention.</p>
        <p><strong>Project Name:</strong> ${projectName}</p>
        <p><strong>Year:</strong> ${year}</p>
        <p>Please log in to review the project details.</p>
        <p>Kind regards,<br/>Support Team</p>
    `
});

export const categoryAssignedTemplate = (userName: string, projectName: string, categoryName: string) => ({
    subject: `You've Been Assigned to a Category`,
    html: `
        <p>Hello ${userName},</p>
        <p>You have been assigned to a new project category.</p>
        <p><strong>Project:</strong> ${projectName}</p>
        <p><strong>Category:</strong> ${categoryName}</p>
        <p>Please log in to view your assignment and start entering data.</p>
        <p>Kind regards,<br/>Support Team</p>
    `
});

export const dataRejectedTemplate = (userName: string, projectName: string, categoryName: string, remark?: string) => ({
    subject: `Your Data Submission Has Been Rejected`,
    html: `
        <p>Hello ${userName},</p>
        <p>Your data submission has been <strong>rejected ❌</strong>.</p>
        <p><strong>Project:</strong> ${projectName}</p>
        <p><strong>Category:</strong> ${categoryName}</p>
        ${remark ? `<p><strong>Remarks:</strong> ${remark}</p>` : ''}
        <p>Please log in to review and resubmit your data.</p>
        <p>Kind regards,<br/>Support Team</p>
    `
});