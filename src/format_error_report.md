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

**Masking:** credentials are replaced by `***` so the report can be logged
or sent to error tracking: in the REQUEST section, and in any URL found in
the message, the stack or a header value.

A name is secret-looking when, split on `_`/`-`/`.` and camelCase boundaries
and lower-cased, any segment is one of these words, or when the whole name
with separators removed is one of them:

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

A segment that ends with `apikey`, `passwd`, `password`, `secret` or `token`
counts too, once a trailing number and a plural `s` are dropped
(`authtoken`, `clientsecret`, `NEWPASSWORD`, `password1`, `tokens`,
`api_keys`). These count only as the whole name: `accesskey`, `assertion`,
`authkey`, `clientassertion`, `code`, `credential`, `credentials`, `csrf`,
`hapikey`, `jwt`, `otp`, `passphrase`, `privatekey`, `pw`, `samlrequest`,
`samlresponse`, `secretkey`, `session`, `sessionid`, `sessionkey`, `sid`,
`xsrf`.

So `api_key`, `apiKey`, `access_token`, `x-auth-token`, `client_secret`,
`sig`, `key`, `code` and `session_id` are masked while `keyword`, `design`,
`author`, `keyboard`, `signal`, `client_id`, `postal_code` and `sidebar` are
not.

**Headers:** a value is masked when the header's name is secret-looking by
the rule above (`X-Goog-Api-Key`, `Private-Token`, `X-Amz-Security-Token`,
`X-CSRF-Token`, ...) or, matched case-insensitively, one of `api-key`,
`authorization`, `cookie`, `proxy-authorization`, `set-cookie`, `x-api-key`,
`x-auth-token`. Headers nested per method the Axios way (`headers.common`,
`headers.get`, ...) and `AxiosHeaders` instances (via `toJSON`) are handled;
the error object itself is not modified.

**URLs:** userinfo is masked up to the last `@` of the authority
(`https://user:p@ss@host` becomes `https://***@host`, a scheme-relative
`//user:pass@host` too), and so is the value of every parameter with a
secret-looking name, in the query and in the fragment, separated by `&` or
`;` (`?token=abc&page=2` becomes `?token=***&page=2`). A value that is itself
a URL or JSON, percent-encoded or not, is masked inside by the same rules.
The rest of the URL is reported verbatim.

**Not masked:** a secret carried in the path of a URL (a bot token, a
webhook address), and the response body, which is only truncated to 10240
characters. The request body is never included.
