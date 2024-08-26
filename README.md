# NBA Player Search System - Sequence Diagram

This sequence diagram demonstrates the process of searching for an NBA player's statistics.

```mermaid
sequenceDiagram
    participant user as User
    participant client as Client
    participant server as Server
    participant database as Database
    participant api as API

    user->>client: Search NBA player
    client->>server: Send search request
    server->>database: Query player
    
    alt Player not found
        database-->>server: Player not found
        server-->>client: Return 'Player not found'
        client-->>user: Display 'Player not found'
    else Player found
        database-->>server: Return player data
        server->>server: Check if player is retired
        
        alt Player is retired
            server-->>client: Return stored stats
            client-->>user: Display stored stats
        else Player is active
            server->>api: Request latest stats
            activate api
            api-->>server: Return latest stats
            deactivate api
            server->>database: Save latest stats
            server-->>client: Return latest stats
            client-->>user: Display latest stats
        end
    end