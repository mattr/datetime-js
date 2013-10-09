if (typeof console === undefined || typeof console.log !== "function")  {
  console = console || {};
  console.log = function()  {
    return arguments;
  };
}