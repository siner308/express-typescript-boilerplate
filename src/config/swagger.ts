import { defaultMetadataStorage } from 'class-transformer/storage';
import { validationMetadatasToSchemas } from 'class-validator-jsonschema';
import { getMetadataStorage } from 'class-validator';
import { getMetadataArgsStorage } from 'routing-controllers';
import { routingControllersToSpec } from 'routing-controllers-openapi';
import env from './env';

const schemas: any = validationMetadatasToSchemas({
  classValidatorMetadataStorage: getMetadataStorage(),
  refPointerPrefix: '#/components/schemas/',
  classTransformerMetadataStorage: defaultMetadataStorage,
});

export const swaggerFile: any = routingControllersToSpec(
  getMetadataArgsStorage(),
  {},
  {
    components: {
      schemas,
    },
  },
);

swaggerFile.info = {
  title: 'express-typescript-template',
  description: 'swagger for express-typescript-template',
  version: '1.0.0',
};

swaggerFile.servers = [
  {
    url: `http://localhost:${env.app.port}`,
  },
];
