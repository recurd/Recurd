Naming conventions of schemas:
- Suffix `T`: The schema transforms ("coerces" in Zod's terms) the value that it matches on

Note:
- To make a schema optional, make it `nullish` (which means it accepts `null` or `optional` values) after all operations (especially after value coercion and pipes).