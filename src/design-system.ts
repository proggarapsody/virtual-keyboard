import { mount } from 'svelte'
import './app.css'
import DesignSystem from './lib/ui/DesignSystem.svelte'
mount(DesignSystem, { target: document.getElementById('app')! })
