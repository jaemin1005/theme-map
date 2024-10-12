use serde::{Deserialize, Deserializer};
use std::str::FromStr;

pub enum SearchType {
    TITLE,
    USER,
}

/**
 * 문자열에서 SearchType으로 변환
 * 역직렬화에서 사용하기 위해
 */
impl FromStr for SearchType {
  type Err = String;

  fn from_str(input: &str) -> Result<SearchType, Self::Err> {
      match input.to_lowercase().as_str() {
          "title" => Ok(SearchType::TITLE),
          "user" => Ok(SearchType::USER),
          _ => Err(format!("Invalid search type: {}", input)),
      }
  }
}

/**
 * into() 
 * SearchType => String으로 변환
 */
impl From<SearchType> for String {
  fn from(search_type: SearchType) -> Self {
      match search_type {
          SearchType::TITLE => "title".to_string(),
          SearchType::USER => "user".to_string(),
      }
  }
}

/**
 * 역직렬화 커스텀
 */
impl<'de> Deserialize<'de> for SearchType {
  fn deserialize<D>(deserializer: D) -> Result<SearchType, D::Error>
  where
      D: Deserializer<'de>,
  {
      let s = String::deserialize(deserializer)?;
      SearchType::from_str(&s).map_err(serde::de::Error::custom)
  }
}

#[derive(Deserialize)]
pub struct SearchQuery {
    pub search_type: SearchType,
    pub body: String,
}
