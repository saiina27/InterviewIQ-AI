 
import { useEffect } from "react";

function SEO({
    title = "InterviewIQ AI | Resume Analysis & AI Mock Interviews",
    description = "Analyze your resume, discover suitable career roles, identify skill gaps and practise personalized AI mock interviews with InterviewIQ AI.",
    noIndex = false
}) {
    useEffect(() => {
        document.title = title;

        const setMeta = (name, content) => {
            let element = document.querySelector(
                `meta[name="${name}"]`
            );

            if (!element) {
                element = document.createElement("meta");
                element.setAttribute("name", name);
                document.head.appendChild(element);
            }

            element.setAttribute("content", content);
        };

        setMeta("description", description);

        setMeta(
            "robots",
            noIndex
                ? "noindex, nofollow"
                : "index, follow, max-image-preview:large"
        );
    }, [title, description, noIndex]);

    return null;
}

export default SEO;
