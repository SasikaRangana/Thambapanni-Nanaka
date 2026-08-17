import urllib.parse
from app.core.config import settings


def format_whatsapp_message(
    item_id: str,
    title: str,
    item_code: str,
    price: float,
    country: str,
    year: int,
    condition_grade: str,
    category: str = "item",
    custom_text: str | None = None,
    image_url: str | None = None,
) -> str:
    """
    Constructs a standardized, professional WhatsApp inquiry message string.
    """
    currency_symbol = settings.DEFAULT_CURRENCY_SYMBOL
    formatted_price = f"{currency_symbol} {price:,.2f}"

    lines = [
        "🌟 *Inquiry - Thambapanni Nanaka Currency Gallery* 🌟",
        "",
        "Hello! I am interested in purchasing / reserving the following item:",
        f"• *Item*: {title}",
        f"• *Item Code*: {item_code}",
        f"• *Category*: {category.title()}",
        f"• *Country & Year*: {country} ({year})",
        f"• *Grade*: {condition_grade}",
        f"• *Price*: {formatted_price}",
        f"• *System ID*: {item_id}",
    ]

    if custom_text:
        lines.append(f"• *Note*: {custom_text}")

    if image_url:
        lines.append(f"• *Image*: {image_url}")

    lines.extend([
        "",
        "Could you please confirm if this item is currently available and provide delivery/payment instructions?",
        "Thank you!",
    ])

    return "\n".join(lines)


def generate_whatsapp_link(
    item_id: str,
    title: str,
    item_code: str,
    price: float,
    country: str,
    year: int,
    condition_grade: str,
    category: str = "item",
    custom_text: str | None = None,
    image_url: str | None = None,
    phone_number: str | None = None,
) -> tuple[str, str]:
    """
    Generates both the plain formatted message string and the direct wa.me URL.
    Returns (whatsapp_inquiry_url, whatsapp_message_text).
    """
    phone = (phone_number or settings.WHATSAPP_PHONE_NUMBER).replace("+", "").replace(" ", "").replace("-", "")
    message = format_whatsapp_message(
        item_id=str(item_id),
        title=title,
        item_code=item_code,
        price=price,
        country=country,
        year=year,
        condition_grade=condition_grade,
        category=category,
        custom_text=custom_text,
        image_url=image_url,
    )
    encoded_message = urllib.parse.quote(message)
    whatsapp_url = f"https://wa.me/{phone}?text={encoded_message}"
    return whatsapp_url, message
