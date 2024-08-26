# NBA Player Search System - Sequence Diagram

This sequence diagram demonstrates the process of searching for an NBA player's statistics.

```mermaid
sequenceDiagram
    actor User
    participant Client
    participant Server
    participant Database
    participant API

    User->>Client: Search NBA player
    Client->>Server: Send search request
    Server->>Database: Query player
    alt Player not found
        Database-->>Server: Player not found
        Server-->>Client: Return 'Player not found'
        Client-->>User: Display 'Player not found'
    else Player found
        Database-->>Server: Return player data
        Server->>Server: Check if player is retired
        alt Player is retired
            Server-->>Client: Return stored stats
            Client-->>User: Display stored stats
        else Player is active
            Server->>API: Request latest stats
            API-->>Server: Return latest stats
            Server->>Database: Save latest stats
            Server-->>Client: Return latest stats
            Client-->>User: Display latest stats
        end
    end
```

This Markdown content includes:

1. A title and brief description
2. The Mermaid sequence diagram code
3. An explanation of the sequence diagram

The Mermaid syntax for sequence diagrams uses the following elements:

- `actor` for the User
- `participant` for system components
- `->` for synchronous messages
- `-->` for responses
- `alt` and `else` for alternative flows
