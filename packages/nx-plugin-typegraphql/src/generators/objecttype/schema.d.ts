type PrimitivePropsType = number | string | boolean;

interface PropsMetadata {
  type: PrimitivePropsType;
  isArray: boolean;
  nullable: boolean;
}

interface AvaliableLib {
  root: string;
  sourceRoot: string;
  libName: string;
}

export interface TypeGraphQLObjectTypeSchema {
  objectTypeName: string;
  extendInterfaceType: boolean;
  // props: Record<string, PropsMetadata>;
  generateDTO: boolean;
  // @midwayjs/decorator ?
  dtoHandler: 'ClassValidator' | 'Joi';
  useTypeormEntityDecorator: boolean;
  extendTypeormBaseEntity: boolean;
  lib: string;
  createLibOnInexist: boolean;
  // exportNameSpace: string;
}
