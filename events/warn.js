module.exports = {
  name: 'warn',
  async execute(info) {
    console.log(`WARNING:\n${info}`)
  }
}