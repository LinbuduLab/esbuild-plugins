export function generateDTONames(className: string) {
  return {
    CreateDTOClassName: `Create${className}DTO`,
    UpdateDTOClassName: `Update${className}DTO`,
    DeleteDTOClassName: `Deleete${className}DTO`,
  };
}

// check all reserved words?
export function isValidNamespace(namespace: string): boolean {
  return (
    // typeof namespace === 'string' &&
    // FIXME: isNaN("") === false
    // isNaN(Number(namespace)) &&
    namespace !== 'true' && namespace !== 'false'
  );
}
