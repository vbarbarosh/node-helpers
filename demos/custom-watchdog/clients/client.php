<?php

main();

function main()
{
    for ($i = 0; $i < 100; ++$i) {
        echo sprintf("[client.php] %s\n", json_encode(ping(getenv('WATCHDOG_SOCKET'))));
        sleep(1);
    }
}

function ping(string $socket_path, string $data = 'PING', int $timeout_ms = 1000): string
{
    $client = stream_socket_client("unix://$socket_path", $error_code, $error_message, $timeout_ms/1000);
    if (!$client) {
        throw new RuntimeException("Connection failed: $error_code: $error_message");
    }
    try {
        stream_set_timeout($client, $timeout_ms/1000, ($timeout_ms % 1000)*1000);
        if (fwrite($client, $data) === false) {
            throw new RuntimeException('Failed to write to socket');
        }
        return stream_get_contents($client); // ⚠️ Blocking read
    }
    finally {
        fclose($client);
    }
}
