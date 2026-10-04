# Role-specific skills used for meaningful resume gap analysis.
# These recommendations do NOT affect the ATS score.

ROLE_SKILLS = {
    "Backend Developer": [
        {
            "name": "Redis / caching",
            "keywords": ["redis", "caching", "cache"],
        },
        {
            "name": "Background jobs / task queues",
            "keywords": [
                "celery",
                "background job",
                "background jobs",
                "task queue",
                "task queues",
            ],
        },
        {
            "name": "Message queues",
            "keywords": [
                "message queue",
                "message queues",
                "rabbitmq",
                "kafka",
                "messaging",
            ],
        },
        {
            "name": "CI/CD",
            "keywords": [
                "ci/cd",
                "continuous integration",
                "continuous delivery",
                "github actions",
                "gitlab ci",
                "jenkins",
            ],
        },
        {
            "name": "Cloud deployment",
            "keywords": [
                "aws",
                "azure",
                "gcp",
                "google cloud",
                "amazon web services",
                "microsoft azure",
                "cloud deployment",
            ],
        },
        {
            "name": "Kubernetes / container orchestration",
            "keywords": [
                "kubernetes",
                "k8s",
                "container orchestration",
            ],
        },
        {
            "name": "Monitoring / observability",
            "keywords": [
                "monitoring",
                "observability",
                "prometheus",
                "grafana",
                "opentelemetry",
                "logging",
                "metrics",
                "tracing",
            ],
        },
        {
            "name": "System design",
            "keywords": [
                "system design",
                "distributed systems",
                "scalable architecture",
                "scalability",
            ],
        },
    ],

    "Python Developer": [
        {
            "name": "Testing / test automation",
            "keywords": ["pytest", "unit testing", "test automation"],
        },
        {
            "name": "Python packaging",
            "keywords": [
                "packaging",
                "pyproject.toml",
                "pip",
                "poetry",
                "setuptools",
            ],
        },
        {
            "name": "Async programming",
            "keywords": [
                "async",
                "asyncio",
                "async programming",
                "async/await",
            ],
        },
        {
            "name": "CI/CD",
            "keywords": [
                "ci/cd",
                "continuous integration",
                "github actions",
                "gitlab ci",
            ],
        },
        {
            "name": "Redis / caching",
            "keywords": ["redis", "caching", "cache"],
        },
        {
            "name": "Logging / observability",
            "keywords": [
                "logging",
                "monitoring",
                "observability",
                "metrics",
            ],
        },
    ],

    "AI Engineer": [
        {
            "name": "PyTorch / TensorFlow",
            "keywords": ["pytorch", "tensorflow"],
        },
        {
            "name": "Machine learning",
            "keywords": [
                "machine learning",
                "scikit-learn",
                "sklearn",
            ],
        },
        {
            "name": "Deep learning",
            "keywords": ["deep learning", "neural network"],
        },
        {
            "name": "Model evaluation",
            "keywords": [
                "model evaluation",
                "evaluation metrics",
                "precision",
                "recall",
                "f1 score",
            ],
        },
        {
            "name": "Vector databases / retrieval",
            "keywords": [
                "vector database",
                "vector databases",
                "pgvector",
                "pinecone",
                "weaviate",
                "milvus",
            ],
        },
        {
            "name": "MLOps",
            "keywords": ["mlops", "model deployment", "model serving"],
        },
    ],

    "Data Analyst": [
        {
            "name": "Excel",
            "keywords": ["excel", "microsoft excel"],
        },
        {
            "name": "Power BI / Tableau",
            "keywords": ["power bi", "tableau"],
        },
        {
            "name": "Statistics",
            "keywords": ["statistics", "statistical analysis"],
        },
        {
            "name": "Data visualization",
            "keywords": [
                "data visualization",
                "data visualisation",
                "visualization",
                "visualisation",
            ],
        },
    ],

    "Full Stack Developer": [
        {
            "name": "React",
            "keywords": ["react", "react.js", "reactjs"],
        },
        {
            "name": "JavaScript",
            "keywords": ["javascript", "typescript"],
        },
        {
            "name": "Node.js",
            "keywords": ["node.js", "nodejs"],
        },
        {
            "name": "Database design",
            "keywords": [
                "postgresql",
                "mysql",
                "mongodb",
                "database design",
            ],
        },
        {
            "name": "CI/CD",
            "keywords": [
                "ci/cd",
                "continuous integration",
                "github actions",
            ],
        },
        {
            "name": "Cloud deployment",
            "keywords": [
                "aws",
                "azure",
                "gcp",
                "cloud deployment",
            ],
        },
    ],
}


def calculate_role_skill_gaps(resume_text: str, predicted_role: str):
    """
    Return meaningful role-relevant areas that are not demonstrated
    in the resume.

    This does NOT affect the ATS score.
    """

    text = resume_text.lower()

    role_requirements = ROLE_SKILLS.get(predicted_role, [])

    missing = []

    for requirement in role_requirements:
        if not any(keyword in text for keyword in requirement["keywords"]):
            missing.append(requirement["name"])

    return missing
