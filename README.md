# NBA Player Search System

This flowchart demonstrates the process of searching for an NBA player's statistics.

```mermaid
graph TD
    A[User] -->|Searches player| B[Client]
    B -->|Sends search request| C[Server]
    C -->|Queries| D[(Database)]
    D -->|Result| E{Player found?}
    E -->|No| F[Return 'Player not found']
    E -->|Yes| G{Is player retired?}
    G -->|Yes| H[Return stored stats]
    G -->|No| I[API]
    I -->|Fetch latest stats| J[Server]
    J -->|Save stats| D
    J -->|Return latest stats| B
    F --> B
    H --> B
    B -->|Display result| A

    classDef user fill:#f9f,stroke:#333,stroke-width:2px;
    classDef client fill:#bbf,stroke:#333,stroke-width:2px;
    classDef server fill:#bfb,stroke:#333,stroke-width:2px;
    classDef database fill:#fbb,stroke:#333,stroke-width:2px;
    classDef api fill:#fbf,stroke:#333,stroke-width:2px;

    class A user;
    class B client;
    class C,J server;
    class D database;
    class I api;