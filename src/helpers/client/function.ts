export function enablePasswordToggle() {
    const inputs = document.querySelectorAll<HTMLInputElement>(".enable-password-toggle");

    inputs.forEach((input) => {
        if (input.parentElement?.querySelector(".password-toggle-btn")) return;

        const btn = document.createElement("button");
        btn.type = "button";
        btn.className =
            "password-toggle-btn absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700";
        btn.innerHTML = "<i class='fas fa-eye'></i>";

        const wrapper = document.createElement("div");
        wrapper.className = "relative w-full";
        input.parentNode?.insertBefore(wrapper, input);
        wrapper.appendChild(input);
        wrapper.appendChild(btn);

        input.classList.add("pr-10");
        btn.addEventListener("click", () => {
            if (input.type === "password") {
                input.type = "text";
                btn.innerHTML = "<i class='fas fa-eye-slash'></i>";
            } else {
                input.type = "password";
                btn.innerHTML = "<i class='fas fa-eye'></i>";
            }
        });
    });
}
export const PasswordValidate = (password: any) => {
    const passwordRegex =
        /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&.+~^|()\/#_=\-])[\w@$!%*?&.+~^|()\/#_=\-]+$/;
    return passwordRegex.test(password);
};
export const isValidEmail = (email: string) => {
    const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
    return emailRegex.test(email);
};

export const IntToEnglish = (number: number): string => {
    if (number === 0) return "Zero";

    const NS = [
        { value: 10000000, str: "Crore" },
        { value: 100000, str: "Lakh" },
        { value: 1000, str: "Thousand" },
        { value: 100, str: "Hundred" },
        { value: 90, str: "Ninety" },
        { value: 80, str: "Eighty" },
        { value: 70, str: "Seventy" },
        { value: 60, str: "Sixty" },
        { value: 50, str: "Fifty" },
        { value: 40, str: "Forty" },
        { value: 30, str: "Thirty" },
        { value: 20, str: "Twenty" },
        { value: 19, str: "Nineteen" },
        { value: 18, str: "Eighteen" },
        { value: 17, str: "Seventeen" },
        { value: 16, str: "Sixteen" },
        { value: 15, str: "Fifteen" },
        { value: 14, str: "Fourteen" },
        { value: 13, str: "Thirteen" },
        { value: 12, str: "Twelve" },
        { value: 11, str: "Eleven" },
        { value: 10, str: "Ten" },
        { value: 9, str: "Nine" },
        { value: 8, str: "Eight" },
        { value: 7, str: "Seven" },
        { value: 6, str: "Six" },
        { value: 5, str: "Five" },
        { value: 4, str: "Four" },
        { value: 3, str: "Three" },
        { value: 2, str: "Two" },
        { value: 1, str: "One" },
    ];

    let result = "";

    for (const n of NS) {
        if (number >= n.value) {
            if (number <= 99) {
                result += n.str;
                number -= n.value;
                if (number > 0) result += " ";
            } else {
                const t = Math.floor(number / n.value);
                const d = number % n.value;
                result += IntToEnglish(t) + " " + n.str;
                if (d > 0) result += " " + IntToEnglish(d);
                return result;
            }
        }
    }

    return result.trim();
};

export const NumberFormatter = (number: number) => {
    if (isNaN(number)) {
        return "Invalid Number";
    }
    return new Intl.NumberFormat("en-US").format(number);
};

export const OnlyFloatAndInteger = (
    e: React.FormEvent<HTMLInputElement>
) => {
    const input = e.currentTarget;

    const elementsToRemove = document.querySelectorAll(
        ".number_validation_message"
    );
    elementsToRemove.forEach((el) => el.remove());

    const parent = input.parentNode as HTMLElement;

    const feedback = parent.querySelector(
        ".invalid-feedback"
    ) as HTMLElement;

    if (feedback) feedback.style.display = "";

    const pattern = /^\d*\.?\d*$/;

    if (input.value && !pattern.test(input.value)) {
        if (feedback) feedback.style.display = "none";

        const existingMessage = parent.querySelector(
            ".number_validation_message"
        );

        if (!existingMessage) {
            const message = document.createElement("p");
            message.textContent = "Please enter a valid number.";
            message.className = "number_validation_message";

            parent.appendChild(message);

            setTimeout(() => {
                message.classList.add(
                    "number_validation_message_fade_out"
                );
                message.addEventListener("transitionend", () => {
                    message.remove();
                    if (feedback) feedback.style.display = "";
                });
            }, 3000);
        }
    }

    input.value = input.value
        .replace(/[^0-9.]/g, "")
        .replace(/^(\d*\.\d*).*$/, "$1");
};

export const OnlyInteger = (e: React.ChangeEvent<HTMLInputElement>) => {
    document
        .querySelectorAll(".number_validation_message")
        .forEach((el) => el.remove());

    const input = e.target;
    const parent = input.parentNode as HTMLElement;

    // Show the invalid feedback if it exists
    const feedback = parent.querySelector(".invalid-feedback") as HTMLElement;
    if (feedback) feedback.style.display = "";

    const pattern = /^[0-9]+$/;

    if (input.value && !pattern.test(input.value)) {
        if (feedback) feedback.style.display = "none";

        const message = document.createElement("p");
        message.textContent = "Use integers only.";
        message.className = "number_validation_message";

        parent.appendChild(message);

        setTimeout(() => {
            message.remove();
            if (feedback) feedback.style.display = "";
        }, 3000);
    }

    input.value = input.value.replace(/[^0-9]/g, "");
};
