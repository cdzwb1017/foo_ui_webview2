# Installation and Configuration

## Prerequisites

1. **Node.js 18+** — [download Node.js](https://nodejs.org/)
2. **foobar2000** with the `foo_ui_webview2` component installed and running
3. **CDP remote debugging enabled** in the component's advanced settings; the runtime uses port `9222`

## Installation

### Option 1: run with npx (recommended)

No global installation is required. Point the MCP client at the package:

```json
{
  "foo-ui-webview2": {
    "command": "npx",
    "args": ["-y", "foo-ui-webview2-mcp"],
    "env": {
      "FB2K_CDP_PORT": "9222"
    },
    "type": "stdio"
  }
}
```

### Option 2: install globally

```bash
npm install -g foo-ui-webview2-mcp
foo-ui-webview2-mcp
```

### Option 3: local development

```bash
cd mcp/
npm install
npm run build
npm start
```

## Client configuration

### VS Code (GitHub Copilot)

Create or edit `.vscode/mcp.json` in the workspace root:

```json
{
  "servers": {
    "foo-ui-webview2": {
      "command": "npx",
      "args": ["-y", "foo-ui-webview2-mcp"],
      "env": {
        "FB2K_CDP_PORT": "9222"
      },
      "type": "stdio"
    }
  }
}
```

### Claude Desktop

Edit the client configuration file:

- **Windows**: `%APPDATA%\\Claude\\claude_desktop_config.json`
- **macOS**: `~/Library/Application Support/Claude/claude_desktop_config.json`

```json
{
  "mcpServers": {
    "foo-ui-webview2": {
      "command": "npx",
      "args": ["-y", "foo-ui-webview2-mcp"],
      "env": {
        "FB2K_CDP_PORT": "9222"
      }
    }
  }
}
```

### Cursor

Add the same server configuration under **MCP Servers** in Cursor settings.

## Environment variables

| Variable | Default | Description |
| --- | --- | --- |
| `FB2K_CDP_PORT` | `9222` | WebView2 CDP debugging port used by the MCP client |
| `FB2K_CDP_HOST` | `localhost` | WebView2 CDP host address |
| `FB2K_ENABLE_EVAL` | unset | Set to `1` or `true` to register `fb2k_evaluate` |

::: warning `FB2K_ENABLE_EVAL`
`fb2k_evaluate` can execute an arbitrary JavaScript expression in the WebView2 page. Keep it disabled outside a trusted development or debugging session.
:::

## CDP connection

### Enable CDP remote debugging

1. Open foobar2000.
2. Go to **Preferences → Advanced → Tools → WebView UI**.
3. Enable **Enable CDP remote debugging on port 9222 (for MCP/AI agents)**.
4. Restart foobar2000.

### Connection sequence

```text
MCP server starts
    │
    ├─ GET http://localhost:9222/json → discover the first non-DevTools page target
    ├─ connect to the target over WebSocket
    ├─ enable Runtime and Page in parallel
    ├─ attempt a 1×1 PNG warm-up capture
    └─ ready for tool calls
```

### Connection failures

| Scenario | Behavior | Action |
| --- | --- | --- |
| foobar2000 is not running | CDP discovery or connection fails | Start foobar2000. |
| CDP is disabled | No page target is available | Enable CDP and restart foobar2000. |
| Host or port does not match | Discovery or connection fails | Set `FB2K_CDP_HOST` / `FB2K_CDP_PORT` to the runtime endpoint. |
| Connection is lost | The cached client is dropped; the next call reconnects | Let the retry sequence complete. |
| A Bridge invocation exceeds the timeout | The call fails after 30 seconds | Check whether foobar2000 or the WebView2 page is responsive. |

## Pairing with Chrome DevTools MCP

The server can be paired with [chrome-devtools-mcp](https://github.com/ChromeDevTools/chrome-devtools-mcp):

| MCP server | Role | Typical use |
| --- | --- | --- |
| `foo-ui-webview2-mcp` | Semantic Bridge API | Playback, playlists, library, queue, and metadata |
| `chrome-devtools-mcp` | Generic browser inspection and interaction | DOM inspection, input, and visual debugging |

Both clients target the WebView2 CDP endpoint at `localhost:9222` by default.

::: tip Connection ownership
If another CDP client prevents this server from attaching to the selected page target, disconnect that client and retry the MCP tool call.
:::
