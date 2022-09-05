import { app } from './app'
import cors from 'cors'

app.use(cors())
app.listen(3000, () => console.log('Server running ...'))
