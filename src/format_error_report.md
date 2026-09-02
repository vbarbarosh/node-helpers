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

**Masking:** credentials are replaced by `***` in the REQUEST
section so the report can be logged or sent to error tracking.

Header values are masked when the name, matched case-insensitively, is one
of:

- `api-key`
- `authorization`
- `cookie`
- `proxy-authorization`
- `set-cookie`
- `x-api-key`
- `x-auth-token`

Headers nested per method the Axios way (`headers.common`, `headers.get`,
...) and `AxiosHeaders` instances (via `toJSON`) are handled; the error
object itself is not modified.

URL userinfo is masked (`https://user:pass@host` becomes
`https://***@host`), and so is the value of every query parameter with a
secret-looking name (`?token=abc&page=2` becomes `?token=***&page=2`). A
name is secret-looking when, split on `_`/`-`/`.` and camelCase boundaries
and lower-cased, any segment is one of the words below, or when the whole
name with separators removed is one of them:

- `accesstoken`
- `apikey`
- `auth`
- `authorization`
- `key`
- `pass`
- `passwd`
- `password`
- `pwd`
- `secret`
- `sig`
- `signature`
- `token`

So `api_key`, `apiKey`, `access_token`, `x-auth-token`, `client_secret`,
`sig` and `key` are masked while `keyword`, `design`, `author`,
`keyboard`, `signal` and `client_id` are not. The rest of the URL is
reported verbatim.

The response body is **not** sanitized — only truncated to 10240
characters — and the request body is never included.
