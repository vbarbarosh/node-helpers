Runs a curl command and turns its progress meter into user-friendly status
lines. `args` is the full command including the binary (`['curl', url, ...]`);
`--no-silent --progress-meter` are appended, plus `-o /dev/null` when the args
contain no `-o` (curl only prints a progress meter when the response body is
redirected). stderr is parsed via `stream_curl_progress` and each row is
reported as `user_friendly_status('42% | 587M of 3217M at 18.5M/s ETA 0:02:22
duration=0:00:31')`; zero speed shows as `~`.

Rejects when the process exits with a non-zero code or is killed by a signal
(only exit code 0 is a success). Extra spawn options go under the `options`
key of the second argument.

## Signature

```
shell_curl_progress(args, {options, user_friendly_status}) → Promise<void>
```
