/**
 * Warnings Display UI System - War1954 Aircraft Creator
 *
 * Manages the display of design warnings and errors to the user.
 * 
 * @version 1.0.0
 */

export class WarningsDisplay {
    /**
     * @param {string} containerId - The ID of the main warnings container element.
     * @param {string} listId - The ID of the element where the list of warnings will be rendered.
     */
    constructor(containerId, listId) {
        this.container = document.getElementById(containerId);
        this.list = document.getElementById(listId);

        if (!this.container || !this.list) {
            console.error('WarningsDisplay: Container or list element not found.');
            return;
        }
        console.log('⚠️ WarningsDisplay initialized');
    }

    /**
     * Updates the display with a new set of warnings and errors.
     * @param {Array<Object>} warnings - An array of warning objects from the calculation systems.
     * @param {Array<Object>} errors - An array of error objects.
     */
    update(warnings = [], errors = []) {
        if (!this.container || !this.list) return;

        this.list.innerHTML = '';
        const allMessages = [...errors, ...warnings];

        if (allMessages.length === 0) {
            this.container.classList.add('hidden');
            return;
        }

        allMessages.forEach(msg => {
            const isError = msg.severity === 'critical' || msg.severity === 'error';
            const messageEl = this._createMessageElement(msg, isError);
            this.list.appendChild(messageEl);
        });

        this.container.classList.remove('hidden');
    }

    /**
     * Creates a single HTML element for a warning or error message.
     * @param {Object} msg - The message object.
     * @param {boolean} isError - True if the message is a critical error.
     * @private
     */
    _createMessageElement(msg, isError) {
        const el = document.createElement('div');
        el.className = `p-3 rounded-lg mb-2 ${isError ? 'bg-red-900/40 text-red-300' : 'bg-amber-900/30 text-amber-300'}`;

        const icon = isError ? '🚨' : '⚠️';

        el.innerHTML = `
            <div class="flex items-start space-x-3">
                <div class="text-xl">${icon}</div>
                <div>
                    <div class="font-semibold">${msg.title || 'Aviso de Design'}</div>
                    <div class="text-sm opacity-90">${msg.message || 'Problema não especificado.'}</div>
                    ${msg.recommendation ? `<div class="text-xs opacity-70 mt-1"><em>Sugestão: ${msg.recommendation}</em></div>` : ''}
                </div>
            </div>
        `;
        return el;
    }
}
