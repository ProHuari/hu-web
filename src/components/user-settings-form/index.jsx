import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import {
    RiUserLine,
    RiLockLine,
    RiBookmarkLine,
    RiNotification3Line,
    RiSave3Line,
    RiCheckLine,
    RiDeleteBinLine,
    RiToggleLine,
    RiToggleFill,
    RiExternalLinkLine,
    RiErrorWarningLine,
} from "react-icons/ri";
import { useApp } from "../../context/AppContext";
import { UF_OPTIONS } from "../../data/lawmakers";
import { userService } from "../../services/user-service";
import { useToast } from "../../context/useToast";
import PasswordInput from "../password-input";
import Badge from "../badge";
import Avatar from "../avatar";
import "./style.css";

export default function UserSettingsForm({ initialData = {}, onSave }) {
    const toast = useToast();
    const {
        user = {},
        updateUser,
        bookmarkedLawmakerIds = [],
        toggleBookmark,
        notifications = {},
        toggleNotification,
    } = useApp() || {};

    const [activeTab, setActiveTab] = useState("profile");
    const [savedSuccess, setSavedSuccess] = useState(false);
    const [profileError, setProfileError] = useState("");
    const [passwordSaved, setPasswordSaved] = useState(false);
    const [passwordError, setPasswordError] = useState("");
    const [isSavingPassword, setIsSavingPassword] = useState(false);

    const [savedLawmakers, setSavedLawmakers] = useState([]);
    const [bookmarksLoaded, setBookmarksLoaded] = useState(false);

    useEffect(() => {
        if (activeTab === "bookmarks") {
            let isMounted = true;

            userService
                .getBookmarkedLawmakers(bookmarkedLawmakerIds)
                .then((lawmakersList) => {
                    if (isMounted && Array.isArray(lawmakersList)) {
                        setSavedLawmakers(lawmakersList);
                    }
                })
                .catch((err) => {
                    console.error("Falha ao carregar parlamentares salvos", err);
                })
                .finally(() => {
                    if (isMounted) {
                        setBookmarksLoaded(true);
                    }
                });

            return () => {
                isMounted = false;
            };
        }
        return undefined;
    }, [activeTab, bookmarkedLawmakerIds]);

    const isLoadingBookmarks = activeTab === "bookmarks" && !bookmarksLoaded;

    const [formData, setFormData] = useState({
        name: user?.name || initialData?.name || "",
        email: user?.email || initialData?.email || "",
        phone: user?.phone || initialData?.phone || "",
        state: user?.state || initialData?.state || "DF",
        bio: user?.bio || initialData?.bio || "",
    });

    const [passwords, setPasswords] = useState({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
    });

    const handleInputChange = (field, value) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
        setProfileError("");
    };

    const handlePasswordChange = (field, value) => {
        setPasswords((prev) => ({ ...prev, [field]: value }));
        setPasswordError("");
    };

    const handleFormSubmit = async (e) => {
        e.preventDefault();
        setProfileError("");
        try {
            await userService.updateProfile(formData);
            if (updateUser) {
                updateUser(formData);
            }
            onSave?.(formData);
            setSavedSuccess(true);
            setTimeout(() => setSavedSuccess(false), 2500);
        } catch (err) {
            console.error("Falha ao atualizar perfil", err);
            const msg = err?.message || "Não foi possível salvar os dados agora.";
            setProfileError(msg);
            toast?.error?.(msg);
        }
    };

    const handlePasswordSubmit = async (e) => {
        e.preventDefault();
        setPasswordError("");

        if (passwords.newPassword.length < 8) {
            setPasswordError("A nova senha deve ter pelo menos 8 caracteres.");
            return;
        }

        if (passwords.newPassword !== passwords.confirmPassword) {
            setPasswordError("As senhas informadas não coincidem.");
            return;
        }

        setIsSavingPassword(true);
        try {
            await userService.updatePassword({
                currentPassword: passwords.currentPassword,
                newPassword: passwords.newPassword,
            });
            setPasswordSaved(true);
            setPasswords({ currentPassword: "", newPassword: "", confirmPassword: "" });
            setTimeout(() => setPasswordSaved(false), 3000);
        } catch (err) {
            setPasswordError(err.message || "Não foi possível atualizar a senha.");
        } finally {
            setIsSavingPassword(false);
        }
    };

    const handleRemoveBookmark = (lawmakerId) => {
        if (toggleBookmark) {
            toggleBookmark(lawmakerId);
        }
        setSavedLawmakers((prev) => prev.filter((l) => Number(l.id) !== Number(lawmakerId)));
    };

    const displayBookmarkCount = bookmarkedLawmakerIds.length || savedLawmakers.length;

    return (
        <section className="user-settings-card" aria-label="Configurações da conta">
            <div className="user-settings-tabs" role="tablist">
                <button
                    type="button"
                    role="tab"
                    aria-selected={activeTab === "profile"}
                    className={`settings-tab-btn ${activeTab === "profile" ? "is-active" : ""}`}
                    onClick={() => setActiveTab("profile")}
                >
                    <RiUserLine size={18} aria-hidden="true" />
                    <span>Dados pessoais</span>
                </button>

                <button
                    type="button"
                    role="tab"
                    aria-selected={activeTab === "bookmarks"}
                    className={`settings-tab-btn ${activeTab === "bookmarks" ? "is-active" : ""}`}
                    onClick={() => setActiveTab("bookmarks")}
                >
                    <RiBookmarkLine size={18} aria-hidden="true" />
                    <span>Parlamentares salvos ({displayBookmarkCount})</span>
                </button>

                <button
                    type="button"
                    role="tab"
                    aria-selected={activeTab === "notifications"}
                    className={`settings-tab-btn ${activeTab === "notifications" ? "is-active" : ""}`}
                    onClick={() => setActiveTab("notifications")}
                >
                    <RiNotification3Line size={18} aria-hidden="true" />
                    <span>Notificações</span>
                </button>

                <button
                    type="button"
                    role="tab"
                    aria-selected={activeTab === "security"}
                    className={`settings-tab-btn ${activeTab === "security" ? "is-active" : ""}`}
                    onClick={() => setActiveTab("security")}
                >
                    <RiLockLine size={18} aria-hidden="true" />
                    <span>Segurança e senha</span>
                </button>
            </div>

            {activeTab === "profile" && (
                <form className="settings-form-panel" onSubmit={handleFormSubmit}>
                    {profileError && (
                        <div className="login-alert-error" role="alert" style={{ marginBottom: "16px" }}>
                            <RiErrorWarningLine size={18} />
                            <span>{profileError}</span>
                        </div>
                    )}

                    <div className="settings-form-grid">
                        <div className="form-field-group">
                            <label className="field-label">Nome completo</label>
                            <input
                                type="text"
                                className="field-input"
                                value={formData.name}
                                onChange={(e) => handleInputChange("name", e.target.value)}
                                required
                            />
                        </div>

                        <div className="form-field-group">
                            <label className="field-label">E-mail cadastrado</label>
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
                                placeholder="(opcional)"
                            />
                        </div>

                        <div className="form-field-group">
                            <label className="field-label">Estado de acompanhamento</label>
                            <select
                                className="field-select"
                                value={formData.state}
                                onChange={(e) => handleInputChange("state", e.target.value)}
                            >
                                {UF_OPTIONS.filter((opt) => opt.value !== "").map((opt) => (
                                    <option key={opt.value} value={opt.value}>
                                        {opt.label}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div className="form-field-group full-width">
                        <label className="field-label">Temas e interesses cívicos</label>
                        <textarea
                            className="field-textarea"
                            rows={3}
                            value={formData.bio}
                            onChange={(e) => handleInputChange("bio", e.target.value)}
                            placeholder="Ex.: educação básica, orçamento municipal, controle de gastos públicos..."
                        />
                    </div>

                    <div className="settings-form-footer">
                        {savedSuccess && (
                            <span className="save-success-msg">
                                <RiCheckLine size={18} aria-hidden="true" />
                                Informações atualizadas.
                            </span>
                        )}
                        <button type="submit" className="btn-save-settings">
                            <RiSave3Line size={18} aria-hidden="true" />
                            <span>Salvar alterações</span>
                        </button>
                    </div>
                </form>
            )}

            {activeTab === "bookmarks" && (
                <div className="settings-saved-panel">
                    <div className="saved-panel-header">
                        <h3>Parlamentares acompanhados</h3>
                        <p>Acesso rápido aos perfis salvos para consulta de despesas e proposições.</p>
                    </div>

                    {isLoadingBookmarks && savedLawmakers.length === 0 ? (
                        <div
                            className="saved-lawmakers-loading"
                            style={{
                                padding: "3rem 1rem",
                                textAlign: "center",
                                display: "flex",
                                flexDirection: "column",
                                alignItems: "center",
                                gap: "1rem",
                            }}
                        >
                            <div className="loading-spinner" />
                            <p style={{ color: "var(--color-text-muted)" }}>Carregando parlamentares salvos...</p>
                        </div>
                    ) : savedLawmakers.length === 0 ? (
                        <div className="empty-bookmarks">
                            <RiBookmarkLine size={36} aria-hidden="true" />
                            <p>Você ainda não salvou nenhum parlamentar.</p>
                            <Link to="/lawmakers" className="btn-save-settings" style={{ textDecoration: "none" }}>
                                Ver diretório de parlamentares
                            </Link>
                        </div>
                    ) : (
                        <div className="saved-lawmakers-list">
                            {savedLawmakers.map((lawmaker) => (
                                <div key={lawmaker.id} className="saved-lawmaker-item">
                                    <div className="saved-lawmaker-info">
                                        <div className="saved-lawmaker-name">
                                            <Avatar
                                                name={lawmaker.name}
                                                src={lawmaker.avatar || "/images/default-avatar.png"}
                                                fallbackSrc="/images/default-avatar.png"
                                                size="sm"
                                            />
                                            <strong>{lawmaker.name}</strong>
                                            <Badge variant="party">{lawmaker.party}</Badge>
                                            <Badge variant="state">{lawmaker.state}</Badge>
                                        </div>
                                        <span className="saved-lawmaker-role">{lawmaker.position || lawmaker.role}</span>
                                    </div>

                                    <div className="saved-lawmaker-actions">
                                        <Link
                                            to={`/lawmakers/${lawmaker.id}`}
                                            className="btn-view-profile"
                                            title="Ver mandato"
                                            style={{
                                                display: "inline-flex",
                                                alignItems: "center",
                                                gap: "4px",
                                                padding: "6px 12px",
                                                borderRadius: "8px",
                                                border: "1px solid #E5E7EB",
                                                backgroundColor: "#FFFFFF",
                                                color: "#374151",
                                                fontSize: "0.8rem",
                                                fontWeight: 600,
                                                textDecoration: "none",
                                            }}
                                        >
                                            <span>Ver perfil</span>
                                            <RiExternalLinkLine size={14} />
                                        </Link>

                                        <button
                                            type="button"
                                            className="btn-remove-bookmark"
                                            onClick={() => handleRemoveBookmark(lawmaker.id)}
                                            title="Remover dos salvos"
                                        >
                                            <RiDeleteBinLine size={16} aria-hidden="true" />
                                            <span>Remover</span>
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}

            {activeTab === "notifications" && (
                <div className="settings-notifications-panel">
                    <div className="notification-row">
                        <div className="notification-text">
                            <strong>Alertas de votações e projetos</strong>
                            <p>Notificações quando houver novas proposições vinculadas aos mandatos acompanhados.</p>
                        </div>
                        <button
                            type="button"
                            className="toggle-btn"
                            onClick={() => toggleNotification?.("votingAlerts")}
                            aria-label="Alternar alertas de votações"
                        >
                            {notifications?.votingAlerts ? (
                                <RiToggleFill size={36} className="toggle-active" />
                            ) : (
                                <RiToggleLine size={36} className="toggle-inactive" />
                            )}
                        </button>
                    </div>

                    <div className="notification-row">
                        <div className="notification-text">
                            <strong>Demonstrativo mensal da Cota Parlamentar</strong>
                            <p>Avisos sobre novos registros de despesas da CEAP na base pública.</p>
                        </div>
                        <button
                            type="button"
                            className="toggle-btn"
                            onClick={() => toggleNotification?.("emailAlerts")}
                            aria-label="Alternar avisos de despesas"
                        >
                            {notifications?.emailAlerts ? (
                                <RiToggleFill size={36} className="toggle-active" />
                            ) : (
                                <RiToggleLine size={36} className="toggle-inactive" />
                            )}
                        </button>
                    </div>

                    <div className="notification-row">
                        <div className="notification-text">
                            <strong>Novas trilhas da Academia Cívica</strong>
                            <p>Comunicados quando novos módulos e aulas estiverem disponíveis.</p>
                        </div>
                        <button
                            type="button"
                            className="toggle-btn"
                            onClick={() => toggleNotification?.("weeklyDigest")}
                            aria-label="Alternar novidades da academia"
                        >
                            {notifications?.weeklyDigest ? (
                                <RiToggleFill size={36} className="toggle-active" />
                            ) : (
                                <RiToggleLine size={36} className="toggle-inactive" />
                            )}
                        </button>
                    </div>
                </div>
            )}

            {activeTab === "security" && (
                <form className="settings-security-panel" onSubmit={handlePasswordSubmit}>
                    {passwordError && (
                        <div className="login-alert-error" role="alert" style={{ marginBottom: "16px" }}>
                            <RiErrorWarningLine size={18} />
                            <span>{passwordError}</span>
                        </div>
                    )}

                    <PasswordInput
                        label="Senha atual"
                        value={passwords.currentPassword}
                        onChange={(e) => handlePasswordChange("currentPassword", e.target.value)}
                        placeholder="Digite sua senha atual"
                        required
                    />

                    <PasswordInput
                        label="Nova senha"
                        value={passwords.newPassword}
                        onChange={(e) => handlePasswordChange("newPassword", e.target.value)}
                        placeholder="Mínimo de 8 caracteres"
                        required
                    />

                    <PasswordInput
                        label="Confirmar nova senha"
                        value={passwords.confirmPassword}
                        onChange={(e) => handlePasswordChange("confirmPassword", e.target.value)}
                        placeholder="Repita a nova senha"
                        required
                    />

                    <div className="settings-form-footer">
                        {passwordSaved && (
                            <span className="save-success-msg">
                                <RiCheckLine size={18} aria-hidden="true" />
                                Senha atualizada.
                            </span>
                        )}
                        <button type="submit" className="btn-save-settings" disabled={isSavingPassword}>
                            <RiLockLine size={18} aria-hidden="true" />
                            <span>{isSavingPassword ? "Atualizando..." : "Atualizar senha"}</span>
                        </button>
                    </div>
                </form>
            )}
        </section>
    );
}

UserSettingsForm.propTypes = {
    initialData: PropTypes.object,
    onSave: PropTypes.func,
};
