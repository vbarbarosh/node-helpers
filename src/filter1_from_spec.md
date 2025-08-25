Creates a filtering function based on the following spec:

1. Substrings are separated by `/`.
2. Each substring may have special characters:
   - `^`: Substring must appear at the beginning.
   - `$`: Substring must appear at the end.
   - `!`: Negates the condition (substring must not appear).
