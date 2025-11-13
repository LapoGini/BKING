# API Documentation

## Files

- **openapi.yaml**: Complete OpenAPI 3.1 specification
- **form.schema.json**: JSON Schema for dynamic forms
- **events.md**: Webhook events documentation
- **ical.md**: Calendar feed documentation
- **examples/**: Example form configurations

## Validation

Validate OpenAPI:
```bash
npx @redocly/cli lint docs/openapi.yaml
```

Validate JSON Schema:
```bash
npx ajv-cli validate -s docs/form.schema.json -d docs/examples/classic_form.json
```

## Generate Types

From OpenAPI:
```bash
npx openapi-typescript docs/openapi.yaml -o packages/shared/types/api.ts
```

## View Documentation

```bash
npx @redocly/cli preview-docs docs/openapi.yaml
```

Swagger UI will be available at `/docs` endpoint in Core API.
