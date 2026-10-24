import { createRoot } from 'react-dom/client'
import './promo.css'
import { AssetSheet } from './AssetSheet'

// Renders one reference still: /promo/index.html?asset=front|point|happy|wink|sheet|logo
const name = new URLSearchParams(location.search).get('asset') ?? 'sheet'
createRoot(document.getElementById('root')!).render(<AssetSheet name={name} />)
