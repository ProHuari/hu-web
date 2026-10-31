import React, { useState } from "react";
import {
    RiUserLine,
    RiShieldLockLine,
    RiBookmarkLine,
    RiNotification3Line,
    RiSave3Line,
    RiCheckLine,
    RiExternalLinkLine,
    RiDeleteBinLine,
    RiToggleLine,
    RiToggleFill,
} from "react-icons/ri";
import "./style.css";

export default function UserSettingsForm({ initialData = {}, onSave }) {
    const [activeTab, setActiveTab] = useState("dados");
    const [savedSuccess, setSavedSuccess] = useState(false);

    // Estado do formulário de dados pessoais
    const [formData, setFormData] = useState({
        name: initialData.name || "Carlos Oliveira",
        email: initialData.email || "carlos.oliveira@huari.org",
        phone: initialData.phone || "(11) 98765-4321",
        state: initialData.state || "SP",
        city: initialData.city || "São Paulo",
        bio: initialData.bio || "Interessado em políticas públicas, transparência fiscal do Congresso Nacional e acompanhamento de proposições legislativas.",
    });

    // Estado de notificações
    const [notifications, setNotifications] = useState({
        emailAlerts: true,
        votingAlerts: true,
        weeklyDigest: false,
        laiUpdates: true,
    });

    // Parlamentares favoritados
    const [bookmarkedLawmakers, setBookmarkedLawmakers] = useState([
        { id: 1, name: "Tabata Amaral", role: "Deputada Federal", party: "PSB", state: "SP" },
        { id: 2, name: "Randolfe Rodrigues", role: "Senador", party: "PT", state: "AP" },
        { id: 3, name: "Alessandro Vieira", role: "Senador", party: "MDB", state: "SE" },
    ]);

    const handleInputChange = (field, value) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
    };

    const handleToggleNotification = (key) => {
        setNotifications((prev) => ({ ...prev, [key]: !prev[key] }));
    };

    const handleRemoveBookmark = (id) => {
        setBookmarkedLawmakers((prev) => prev.filter((item) => item.id !== id));
    };

    const handleFormSubmit = (e) => {
        e.preventDefault();
        setSavedSuccess(true);
        onSave?.(formData);
        setTimeout(() => setSavedSuccess(false), 2500);
    };

    return (
        <section className="user-settings-card">
            {/* Navegação por Abas */}
            <div className="user-settings-tabs" role="tablist">
                <button
                    type="button"
                    className={`settings-tab-btn ${activeTab === "dados" ? "is-active" : ""}`}
                    onClick={() => setActiveTab("dados")}
                >
                    <RiUserLine size={18} />
                    <span>Dados Pessoais</span>
                </button>

                <button
                    type="button"
                    className={`settings-tab-btn ${activeTab === "favoritos" ? "is-active" : ""}`}
                    onClick={() => setActiveTab("favoritos")}
                >
                    <RiBookmarkLine size={18} />
                    <span>Parlamentares Salvos ({bookmarkedLawmakers.length})</span>
                </button>

                <button
                    type="button"
                    className={`settings-tab-btn ${activeTab === "notificacoes" ? "is-active" : ""}`}
                    onClick={() => setActiveTab("notificacoes")}
                >
                    <RiNotification3Line size={18} />
                    <span>Notificações & Alertas</span>
                </button>

                <button
                    type="button"
                    className={`settings-tab-btn ${activeTab === "seguranca" ? "is-active" : ""}`}
                    onClick={() => setActiveTab("seguranca")}
                >
                    <RiShieldLockLine size={18} />
                    <span>Segurança & Senha</span>
                </button>
            </div>

            {/* Conteúdo da Aba: Dados Pessoais */}
            {activeTab === "dados" && (
                <form className="settings-form-panel" onSubmit={handleFormSubmit}>
                    <div className="settings-form-grid">
                        <div className="form-field-group">
                            <label className="field-label">Nome Completo</label>
                            <input
                                type="text"
                                className="field-input"
                                value={formData.name}
                                onChange={(e) => handleInputChange("name", e.target.value)}
                                required
                            />
                        </div>

                        <div className="form-field-group">
                            <label className="field-label">E-mail Cadastrado</label>
                            <input
                                type="email"
                                className="field-input"
                                value={formData.email}
                                onChange={(e) => handleInputChange("email", e.target.value)}
                                required
                            />
                        </div>

                        <div className="form-field-group">
                            <label className="field-label">Telefone / WhatsApp</label>
                            <input
                                type="tel"
                                className="field-input"
                                value={formData.phone}
                                onChange={(e) => handleInputChange("phone", e.target.value)}
                            />
                        </div>

                        <div className="form-field-group">
                            <label className="field-label">Estado de Interesse Cívico</label>
                            <select
                                className="field-select"
                                value={formData.state}
                                onChange={(e) => handleInputChange("state", e.target.value)}
                            >
                                <option value="SP">São Paulo (SP)</option>
                                <option value="RJ">Rio de Janeiro (RJ)</option>
                                <option value="MG">Minas Gerais (MG)</option>
                                <option value="DF">Distrito Federal (DF)</option>
                                <option value="RS">Rio Grande do Sul (RS)</option>
                                <option value="BA">Bahia (BA)</option>
                                <option value="PR">Paraná (PR)</option>
                            </select>
                        </div>
                    </div>

                    <div className="form-field-group full-width">
                        <label className="field-label">Biografia / Interesses Cívicos</label>
                        <textarea
                            className="field-textarea"
                            rows={3}
                            value={formData.bio}
                            onChange={(e) => handleInputChange("bio", e.target.value)}
                        />
                        <span className="field-hint">
                            Esta descrição ajuda a personalizar sugestões de votações e projetos de lei.
                        </span>
                    </div>

                    <div className="settings-form-footer">
                        {savedSuccess && (
                            <span className="save-success-msg">
                                <RiCheckLine size={18} />
                                Informações salvas com sucesso!
                            </span>
                        )}
                        <button type="submit" className="btn-save-settings">
                            <RiSave3Line size={18} />
                            <span>Salvar Alterações</span>
                        </button>
                    </div>
                </form>
            )}

            {/* Conteúdo da Aba: Parlamentares Salvos */}
            {activeTab === "favoritos" && (
                <div className="settings-saved-panel">
                    <div className="saved-panel-header">
                        <h3>Parlamentares Monitorados por Você</h3>
                        <p>Receba resumos semanais de votações e gastos destes mandatos.</p>
                    </div>

                    {bookmarkedLawmakers.length === 0 ? (
                        <div className="empty-bookmarks">
                            <RiBookmarkLine size={32} />
                            <p>Você ainda não está seguindo nenhum parlamentar.</p>
                        </div>
                    ) : (
                        <div className="saved-lawmakers-list">
                            {bookmarkedLawmakers.map((lawmaker) => (
                                <div key={lawmaker.id} className="saved-lawmaker-item">
                                    <div className="saved-lawmaker-info">
                                        <div className="saved-lawmaker-name">
                                            <strong>{lawmaker.name}</strong>
                                            <span className="saved-badge-party">{lawmaker.party}</span>
                                            <span className="saved-badge-state">{lawmaker.state}</span>
                                        </div>
                                        <span className="saved-lawmaker-role">{lawmaker.role}</span>
                                    </div>

                                    <div className="saved-lawmaker-actions">
                                        <button
                                            type="button"
                                            className="btn-remove-bookmark"
                                            onClick={() => handleRemoveBookmark(lawmaker.id)}
                                            title="Deixar de seguir"
                                        >
                                            <RiDeleteBinLine size={16} />
                                            <span>Remover</span>
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}

            {/* Conteúdo da Aba: Notificações */}
            {activeTab === "notificacoes" && (
                <div className="settings-notifications-panel">
                    <div className="notification-row">
                        <div className="notification-text">
                            <strong>Alertas de Votações em Tempo Real</strong>
                            <p>Notificar quando um parlamentar monitorado votar em plenário.</p>
                        </div>
                        <button
                            type="button"
                            className="toggle-btn"
                            onClick={() => handleToggleNotification("votingAlerts")}
                        >
                            {notifications.votingAlerts ? (
                                <RiToggleFill size={36} className="toggle-active" />
                            ) : (
                                <RiToggleLine size={36} className="toggle-inactive" />
                            )}
                        </button>
                    </div>

                    <div className="notification-row">
                        <div className="notification-text">
                            <strong>Relatório Mensal de Gastos (CEAP)</strong>
                            <p>Receber fechamento consolidado dos gastos da cota parlamentar por e-mail.</p>
                        </div>
                        <button
                            type="button"
                            className="toggle-btn"
                            onClick={() => handleToggleNotification("emailAlerts")}
                        >
                            {notifications.emailAlerts ? (
                                <RiToggleFill size={36} className="toggle-active" />
                            ) : (
                                <RiToggleLine size={36} className="toggle-inactive" />
                            )}
                        </button>
                    </div>

                    <div className="notification-row">
                        <div className="notification-text">
                            <strong>Resumo Semanal da Academia Cívica</strong>
                            <p>Novos cursos, infográficos e aulas publicadas na plataforma.</p>
                        </div>
                        <button
                            type="button"
                            className="toggle-btn"
                            onClick={() => handleToggleNotification("weeklyDigest")}
                        >
                            {notifications.weeklyDigest ? (
                                <RiToggleFill size={36} className="toggle-active" />
                            ) : (
                                <RiToggleLine size={36} className="toggle-inactive" />
                            )}
                        </button>
                    </div>
                </div>
            )}

            {/* Conteúdo da Aba: Segurança */}
            {activeTab === "seguranca" && (
                <form
                    className="settings-security-panel"
                    onSubmit={(e) => {
                        e.preventDefault();
                        alert("Senha atualizada com sucesso!");
                    }}
                >
                    <div className="form-field-group">
                        <label className="field-label">Senha Atual</label>
                        <input
                            type="password"
                            className="field-input"
                            placeholder="Digite sua senha atual"
                            required
                        />
                    </div>

                    <div className="form-field-group">
                        <label className="field-label">Nova Senha</label>
                        <input
                            type="password"
                            className="field-input"
                            placeholder="Mínimo de 8 caracteres"
                            required
                        />
                    </div>

                    <div className="form-field-group">
                        <label className="field-label">Confirmar Nova Senha</label>
                        <input
                            type="password"
                            className="field-input"
                            placeholder="Repita a nova senha"
                            required
                        />
                    </div>

                    <div className="settings-form-footer">
                        <button type="submit" className="btn-save-settings">
                            <RiShieldLockLine size={18} />
                            <span>Atualizar Senha</span>
                        </button>
                    </div>
                </form>
            )}
        </section>
    );
}
