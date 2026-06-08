type SlackBlock = {
    type: string;
    block_id?: string;
    text?: { type: string; text: string };
    fields?: { type: string; text: string }[];
    elements?: { type: string; text: string }[];
};
 
interface SlackPayload {
    blocks: SlackBlock[];
}
 
export async function sendNotificationMessage(
    message: string,
    isReport = false
): Promise<boolean> {
 
    const hookUrl = process.env.SLACK_NOTIFICATIONS_URI;

    if (!hookUrl) {
        return false;
    }
 
    const payload: SlackPayload = {
        blocks: [
            {
                type: "section",
                block_id: "section-1",
                text: {
                    type: "mrkdwn",
                    text: message,
                },
            },
        ],
    };
 
    try {
        const res = await fetch(hookUrl, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(payload),
        });
        if (!res.ok) {
            const text = await res.text();
            return false;
        }
        return true;
    } catch (error: any) {
        return false;
    }
}
 
export async function sendJsonMessage(jsonMessage: string | object): Promise<boolean> {

    const hookUrl = process.env.SLACK_NOTIFICATIONS_URI;
 
    if (!hookUrl) {
        console.error("Slack webhook URL is not configured.");
        return false;
    }
    let message = typeof jsonMessage === "object" ? JSON.stringify(jsonMessage, null, 2) : jsonMessage;
    message = `\`\`\`\n${message}\n\`\`\``;
    if (message.length > 4000) {
        message = message.slice(0, 4000) + "\n... (truncated)";
    }
    const payload: SlackPayload = {
        blocks: [
            {
                type: "section",
                block_id: "section-1",
                text: {
                    type: "mrkdwn",
                    text: message,
                },
            },
        ],
    };
    try {
        const res = await fetch(hookUrl, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(payload),
        });
        if (!res.ok) {
            const text = await res.text();
            return false;
        }
        return true;
    } catch (error: any) {
        return false;
    }
}
 
export async function sendErrorMessage(
    exceptionMessage: string,
    options?: {
        userName?: string;
        requestData?: string;
    }
): Promise<boolean> {
    const hookUrl = process.env.SLACK_ERRORS_URI;
    if (!hookUrl) {
        return false;
    }
    const { userName = "Unknown user", requestData = "No request data" } = options || {};
    const payload: SlackPayload = {
        blocks: [
            {
                type: "section",
                text: {
                    type: "mrkdwn",
                    text: "*An Exception Occurred in Cemento.*",
                },
            },
            {
                type: "section",
                fields: [
                    {
                        type: "mrkdwn",
                        text: `*Error Type:*\n${exceptionMessage}`,
                    },
                ],
            },
            {
                type: "section",
                fields: [
                    {
                        type: "mrkdwn",
                        text: `*User:*\n${userName}`,
                    },
                ],
            },
            {
                type: "section",
                fields: [
                    {
                        type: "mrkdwn",
                        text: `*Request Data:*\n${requestData}`,
                    },
                ],
            },
            {
                type: "context",
                elements: [
                    {
                        type: "mrkdwn",
                        text: "⚠️ Please investigate the issue.",
                    },
                ],
            },
        ],
    };
 
    try {
        const res = await fetch(hookUrl, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(payload),
        });
        if (!res.ok) {
            await res.text();
            return false;
        }
        return true;
    } catch (error: any) {
        return false;
    }
}