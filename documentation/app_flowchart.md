flowchart TD
    A[App Launch] --> B{Authenticated?}
    B -- No --> C[Show Sign In]
    C --> D[Google Sign In]
    D --> B
    B -- Yes --> E[Main Tabs]
    E --> F[Chat Tab]
    E --> G[Tasks Tab]
    E --> H[Calendar Tab]
    E --> I[Settings Tab]
    F --> J[Chat Interface]
    G --> K[Task List]
    K --> L[Add Edit Task]
    H --> M[Calendar View]
    M --> N[Add Edit Event]
    I --> O[Settings Menu]
