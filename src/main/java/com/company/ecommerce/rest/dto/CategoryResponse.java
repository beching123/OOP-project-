package com.company.ecommerce.rest.dto;

public class CategoryResponse {
    private Long id;
    private String name;
    private String description;
    private String image;
    private Integer itemCount;
    private String icon;

    public CategoryResponse() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public String getImage() { return image; }
    public void setImage(String image) { this.image = image; }

    public Integer getItemCount() { return itemCount; }
    public void setItemCount(Integer itemCount) { this.itemCount = itemCount; }

    public String getIcon() { return icon; }
    public void setIcon(String icon) { this.icon = icon; }
}
