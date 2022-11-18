import pg from "pg"

export const pool = new pg.Pool({
    user: process.env.POSTGRES_USER,
    host: 'pg',
    database: 'default',
    password: process.env.POSTGRES_PASSWORD,
})

export const db = {
    async query(text) {
        const start = Date.now()
        const res = await pool.query(text)
        const duration = Date.now() - start
        // console.log('\nexecuted query', { text, duration, rows: res.rowCount })
        return res
    },
    async queryRows(text) {
        const { rows } = await pool.query(text)
        return rows
    },
    async getClient() {
        const client = await pool.connect()
        const query = client.query
        const release = client.release
        // set a timeout of 5 seconds, after which we will log this client's last query
        const timeout = setTimeout(() => {
            console.error('A client has been checked out for more than 5 seconds!')
            console.error(`The last executed query on this client was: ${client.lastQuery}`)
        }, 5000)
        // monkey patch the query method to keep track of the last query executed
        client.query = (...args) => {
            client.lastQuery = args
            return query.apply(client, args)
        }
        client.release = () => {
            // clear our timeout
            clearTimeout(timeout)
            // set the methods back to their old un-monkey-patched version
            client.query = query
            client.release = release
            return release.apply(client)
        }
        return client
    }
}