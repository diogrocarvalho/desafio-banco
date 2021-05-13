package br.com.diogo.bank.util;

import org.springframework.data.domain.Page;
import org.springframework.http.HttpHeaders;

public final class ResourcesUtils {
    private ResourcesUtils() {}

    public static HttpHeaders addPaginationHeader(Page page) {
        HttpHeaders headers = new HttpHeaders();
        headers.add("X-Total-Count", String.valueOf(page.getTotalElements()));
        return headers;
    }
}