Formats an error into a multi-line text report suitable for logs. Axios
errors get special treatment; everything else becomes indented JSON.

**Rules:**
- Axios error with a response (`error.response.status/statusText/config`) —
  plain-text report with `--- REQUEST ---` (method, url, headers),
  `--- RESPONSE ---` (status, first 10240 chars of body), and `--- STACK ---` sections.
- Axios error without a response (`error.config`) — same, minus the RESPONSE section.
- Any other truthy error — JSON with `code`, `name`, `message`, and `stack`
  split into an array of lines (circular-safe via `json_stringify_safe`).
- Falsy error — `{"error":null}`-style JSON; `undefined` is reported as the
  string `'---undefined---'`.
