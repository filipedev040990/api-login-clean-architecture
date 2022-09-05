import { app } from './app'
import cors from 'cors'
import config from './infra/config'

app.use(cors())
app.listen(config.server.port, () => console.log(`Server running at ${config.server.port}`))
