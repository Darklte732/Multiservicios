# Facebook Automation Config — Auto-Replies, FAQs, Scheduling

This is the autonomous engine. Once configured, your page works while you sleep.

**Where to do this:** Meta Business Suite → Inbox → Automated responses (or Settings → Automated responses)

URL: https://business.facebook.com/latest/inbox/automated_responses

---

## PART 1 — Greeting Message (auto-sent to first-time DMs)

**Setting:** Inbox → Automated responses → Instant reply → On

**Message (Spanish, paste exactly):**

```
¡Hola! Gracias por escribir a MultiServicios El Seibo ⚡

Para atenderte rápido, cuéntanos:
1️⃣ ¿Qué problema tienes?
2️⃣ ¿En qué zona estás? (El Seibo, Miches, Hato Mayor, Sabana de la Mar, Bayaguana, Los Llanos)
3️⃣ ¿Es una emergencia?

🚨 Si es EMERGENCIA AHORA, llama directo: (809) 251-4329
⏰ Horario regular: Lunes a Sábado 8am-6pm
🌐 Agenda en línea: multiservicios.app

Te respondemos lo más rápido posible 🙏
```

**Personalization tokens to add:** `{{user_first_name}}` after "¡Hola" → renders as "¡Hola María!" — increases open rate.

---

## PART 2 — Away Message (out of business hours)

**Setting:** Inbox → Automated responses → Away message → On

**Schedule:** Active Mon-Sat 6:00 PM – 8:00 AM, all day Sunday

**Message:**

```
Estamos fuera de horario regular. Vimos tu mensaje y te respondemos a primera hora 🙏

🚨 SI ES EMERGENCIA, no esperes — llama YA al (809) 251-4329. Atendemos urgencias 24/7.

⏰ Horario regular: Lunes a Sábado 8am-6pm.
🌐 Mientras tanto, puedes ver nuestros servicios en multiservicios.app
```

---

## PART 3 — FAQ Auto-Responses (the gold mine)

**Setting:** Inbox → Automated responses → Frequently asked questions → Add new

For each FAQ, you create a question button users can tap, and the auto-response fires. Configure these 10:

### FAQ 1 — Hours
- **Question shown to user:** ¿Cuál es el horario?
- **Auto-response:**
```
⏰ Horario regular: Lunes a Sábado, 8:00 AM - 6:00 PM
🚨 Emergencias: 24/7, todos los días incluso feriados.

📲 (809) 251-4329
```

### FAQ 2 — Pricing
- **Question:** ¿Cuánto cuesta el servicio?
- **Auto-response:**
```
Cada trabajo es diferente, por eso preferimos verlo antes de dar precio.

✅ EVALUACIÓN GRATIS si contratas el servicio
✅ Precio transparente sin sorpresas
✅ Aceptamos efectivo, transferencia y tarjeta

📲 Llámanos para visitarte: (809) 251-4329
```

### FAQ 3 — Location / Coverage
- **Question:** ¿Dónde trabajan?
- **Auto-response:**
```
Cubrimos un radio de 60 km desde El Seibo:
✅ El Seibo (centro)
✅ Miches (25 km)
✅ Hato Mayor (30 km)
✅ Los Llanos (35 km)
✅ Sabana de la Mar (40 km)
✅ Bayaguana (50 km)

📲 ¿Estás dentro de la zona? Escríbenos: (809) 251-4329
```

### FAQ 4 — Guarantee
- **Question:** ¿Dan garantía?
- **Auto-response:**
```
✅ SÍ - garantía por escrito en cada trabajo:

🚨 Emergencias: 15 días
🔧 Reparaciones: 45 días
📋 Mantenimiento: 60 días
⚡ Instalaciones: 90 días

Si algo falla en ese tiempo, regresamos sin costo.

📲 (809) 251-4329
```

### FAQ 5 — Emergency
- **Question:** Tengo una emergencia
- **Auto-response:**
```
🚨 EMERGENCIA - llama YA, no esperes mensajes:

📞 (809) 251-4329

Atendemos 24/7, llegamos en menos de 30 minutos en El Seibo y zonas cercanas.

⚠️ Si hay olor a quemado, humo, chispas o riesgo de incendio: corta el breaker general AHORA y llámanos.
```

### FAQ 6 — Booking
- **Question:** ¿Cómo agendo?
- **Auto-response:**
```
3 formas de agendar:

1️⃣ WhatsApp: (809) 251-4329 (más rápido)
2️⃣ Llamada: (809) 251-4329
3️⃣ En línea: multiservicios.app/booking

Te confirmamos hora y zona en minutos 📲
```

### FAQ 7 — Experience / Credentials
- **Question:** ¿Tienen experiencia / licencia?
- **Auto-response:**
```
✅ +15 años de experiencia
✅ Licencia CDEEE (Corporación Dominicana de Empresas Eléctricas Estatales)
✅ Seguro de responsabilidad civil
✅ +1,000 proyectos completados
✅ 4.9⭐ con 200+ reseñas reales

📲 Conócenos: (809) 251-4329
```

### FAQ 8 — Payment Methods
- **Question:** ¿Qué medios de pago aceptan?
- **Auto-response:**
```
Aceptamos:
💵 Efectivo
🏦 Transferencia bancaria
💳 Tarjeta de crédito/débito (Visa, Mastercard)

📄 Damos comprobante fiscal si lo necesitas para tu negocio.
```

### FAQ 9 — Quote on the spot
- **Question:** ¿Hacen cotización?
- **Auto-response:**
```
✅ SÍ - cotización GRATIS en sitio si contratas el servicio.

Visitamos, evaluamos, te explicamos qué se necesita y te damos precio claro. Sin compromiso.

📲 Agenda visita: (809) 251-4329
```

### FAQ 10 — Materials
- **Question:** ¿Incluyen los materiales?
- **Auto-response:**
```
Trabajamos de dos formas, según prefieras:

1️⃣ Tú compras los materiales (te damos lista exacta)
2️⃣ Nosotros traemos todo (incluido en el precio)

Materiales de marcas reconocidas con garantía. Sin sorpresas.

📲 Pregúntanos: (809) 251-4329
```

---

## PART 4 — Saved Replies (for human use)

**Setting:** Inbox → Saved replies → Create new

These are templates you click to insert when responding manually. Faster than re-typing.

### Template 1 — Quick yes
**Trigger:** "yes" / "ok"
```
Listo {{user_first_name}}, ¿cuál es la dirección? Y un teléfono donde te pueda llamar para coordinar 📲
```

### Template 2 — Pricing follow-up
```
Para darte un precio justo necesito ver el trabajo. La evaluación es GRATIS si contratas el servicio.

¿En qué zona estás? Te coordino una visita rápida.
```

### Template 3 — Confirmation
```
Confirmado para el [DÍA] a las [HORA] en [ZONA].

📍 Dirección: [DIRECCIÓN]
📲 Mi número: (809) 251-4329 (escríbeme si necesitas reagendar)

Llegaré en uniforme, con identificación visible. ¡Nos vemos pronto!
```

### Template 4 — After job
```
Listo {{user_first_name}} 🙏 Trabajo completado con garantía de [X] días.

Si quedaste contento, ¿podrías dejarnos una reseña en Facebook? Toma 30 segundos: [Link a reseñas]

Si algo no quedó perfecto, dímelo a mí primero. Lo arreglo gratis.
```

### Template 5 — Politely decline (out of zone)
```
Gracias por escribir {{user_first_name}}. Lamentablemente esa zona queda fuera de nuestro radio de cobertura (60 km desde El Seibo).

¿Conoces a alguien en El Seibo, Miches, Hato Mayor, Los Llanos, Sabana de la Mar o Bayaguana? Compártele nuestro contacto: (809) 251-4329 🙏
```

---

## PART 5 — Comment Auto-Reply (Meta's automation tool)

**Setting:** Meta Business Suite → Inbox → Automation → Comments

For each ad you run, set up auto-reply on comments. When someone comments specific keywords, they get DM'd automatically.

### Configuration

**Trigger keywords (case insensitive):**
- precio, costo, cuánto, cuanto cuesta
- info, información
- emergencia, urgente
- horario, horarios, horas
- whatsapp, wsp

**Auto-DM (sent privately):**
```
¡Hola! Vi tu comentario 👋

Para atenderte personalmente, escríbenos al WhatsApp: (809) 251-4329 o agenda en multiservicios.app

⚡ Servicio eléctrico profesional en El Seibo, 15+ años, garantía incluida.

¿En qué te ayudamos?
```

**Auto-comment-reply (public, optional):**
```
¡Gracias {{user_first_name}}! Te enviamos información por mensaje 📲
```

This pattern is GOLD because:
1. People who comment "precio" get a private DM with the WhatsApp link
2. The public reply tells everyone else watching that we engage
3. Facebook's algorithm boosts posts with high engagement
4. You catch leads who never would have DM'd on their own

---

## PART 6 — Scheduling Posts in Meta Business Suite

**URL:** https://business.facebook.com/latest/posts/scheduled_posts

### How to bulk-schedule a week
1. Open Meta Business Suite → Posts & stories → Create post
2. Write the post (use copy from `FACEBOOK_30_DAY_CALENDAR.md`)
3. Add image/video
4. Click the dropdown next to "Publish" → "Schedule post"
5. Choose date/time
6. Confirm

**Best times to post (Dominican Republic, based on Latin American Facebook usage):**
- 7:00–8:00 AM (morning commute)
- 12:00–1:00 PM (lunch)
- 6:00–8:00 PM (evening, peak engagement)
- Reels especially: 7:00 PM and 9:00 PM

### Recommended weekly schedule
| Day | Post type | Time |
|---|---|---|
| Monday | Educational | 7:30 AM |
| Tuesday | Before/after | 12:00 PM |
| Tuesday | Reel #1 (educational) | 7:00 PM |
| Wednesday | Testimonial | 7:30 AM |
| Thursday | Service spotlight | 12:00 PM |
| Thursday | Reel #2 (job) | 7:00 PM |
| Friday | Educational + offer | 7:30 AM |
| Saturday | Emergency reminder | 11:00 AM |
| Saturday | Reel #3 (BTS) | 7:00 PM |
| Sunday | Community/family | 5:00 PM |

### Pro tip: bulk-schedule 2 weeks at a time
Saturday morning is "scheduling day". Spend 90 minutes:
1. Pull copy from the 30-day calendar
2. Add images (use Canva Pro template)
3. Schedule 14 posts in one sitting
4. Done — your page runs autonomously for 2 weeks

---

## PART 7 — Stories (the free reach machine)

**Stories don't get scheduled the same way as posts.** Best to post live, but you CAN schedule them in Business Suite.

### Daily story checklist
- [ ] 1 story showing today's job (action shot)
- [ ] 1 story with a poll or question sticker
- [ ] 1 story with the WhatsApp link sticker (drives DMs)

### Story templates (rotate)
- "Hoy en [zona]" — current job
- Poll: "¿Has tenido apagón esta semana? Sí / No"
- Quiz: "¿Cuántos años tiene tu instalación eléctrica? <10 / 10-20 / 20+ / No sé"
- Q&A sticker: "Pregúntame sobre electricidad"
- Behind-scenes: "El día empieza así" (loading truck, having coffee)
- Customer testimonial screenshot
- "Antes/después" photo
- Throwback: "Trabajos memorables"

### Highlights (permanent stories on profile)
Create these 5 highlights from your best stories:

| Highlight | Cover | Content |
|---|---|---|
| 🔧 Trabajos | Yellow tools icon | Best before/after stories |
| ⭐ Testimonios | Yellow stars icon | Customer voice notes & reviews |
| 🚨 Emergencias | Red lightning icon | Real emergency stories |
| 👋 Sobre Neno | Photo of Neno | About-us, history, values |
| 📞 Contacto | Phone icon | Hours, phone, WhatsApp, location |

---

## PART 8 — Inbox Labels (organize leads)

**Setting:** Inbox → Labels → Create

Create these to triage:

- 🔴 **Emergency** (red)
- 🟡 **New lead** (yellow)
- 🟢 **Quoted** (green)
- 🔵 **Booked** (blue)
- ⚫ **Won/Closed** (black)
- ⚪ **Lost/Cold** (gray)

Apply to every conversation. At end of week, filter "New lead" + "Quoted" — that's your follow-up list.

---

## PART 9 — Page Settings to Verify

**Setting:** Settings (left sidebar) → review each section

### Page roles
- Owner: Neno (you)
- Admin: 1 backup person (family member or trusted employee)

### Privacy & visibility
- Page is published: ✅
- Visible to: Public (everyone)
- Country/age restrictions: None

### Notifications
- Turn ON push notifications for messages, comments, mentions, reviews
- Turn ON email notifications for new followers, new reviews

### Reviews
- Allow reviews: ✅ ON

### Templates
- Choose template: **Services** (gives best layout for service businesses)

---

## ✅ Done with automation

Once everything in this doc is configured, your page handles:
- New DMs at any hour (auto-greeting)
- After-hours messages (auto-away with emergency line)
- 10 most common questions (FAQ buttons)
- Comment-to-DM conversion (auto-reply automation)
- Scheduled posts (Business Suite)

**Time to set up everything in this doc:** ~60 minutes total.
**Time saved per week after setup:** 5–8 hours.

Next: launch ads. See `FACEBOOK_ADS_PLAYBOOK.md`.
